import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO, toBool } from '@/lib/db';
import { checkRateLimit } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { notifyNewComment } from '@/lib/discord-notification';

// GET: Fetch comments by targetId and targetType
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType') || 'project';

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required.' }, { status: 400 });
    }

    const db = await getDB();

    const { results: comments } = await db
      .prepare(
        `SELECT c.*, u.nickname, u.avatar, u.role
         FROM Comment c
         LEFT JOIN User u ON c.authorId = u.id
         WHERE c.targetId = ? AND c.targetType = ? AND c.isDeleted = 0 AND c.parentId IS NULL
         ORDER BY c.createdAt DESC`
      )
      .bind(targetId, targetType)
      .all();

    const commentIds = (comments || []).map((c: Record<string, unknown>) => c.id as string);
    let replies: Record<string, unknown>[] = [];

    if (commentIds.length > 0) {
      const placeholders = commentIds.map(() => '?').join(',');
      const { results: replyResults } = await db
        .prepare(
          `SELECT c.*, u.nickname, u.avatar, u.role
           FROM Comment c
           LEFT JOIN User u ON c.authorId = u.id
           WHERE c.parentId IN (${placeholders}) AND c.isDeleted = 0
           ORDER BY c.createdAt ASC`
        )
        .bind(...commentIds)
        .all();
      replies = (replyResults || []) as Record<string, unknown>[];
    }

    const commentsWithReplies = (comments || []).map((comment: Record<string, unknown>) => ({
      ...comment,
      isDeleted: toBool(comment.isDeleted as number),
      isReported: toBool(comment.isReported as number),
      author: {
        id: comment.authorId,
        nickname: comment.nickname,
        avatar: comment.avatar,
        role: comment.role,
      },
      replies: replies.filter((r) => r.parentId === comment.id).map((reply) => ({
        ...reply,
        isDeleted: toBool(reply.isDeleted as number),
        isReported: toBool(reply.isReported as number),
        author: {
          id: reply.authorId,
          nickname: reply.nickname,
          avatar: reply.avatar,
          role: reply.role,
        },
      })),
    }));

    return NextResponse.json({ comments: commentsWithReplies });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Create a comment
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 30, 60000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as Record<string, unknown>;
    const { content, targetId, targetType, parentId } = body;

    if (!content || !String(content).trim()) {
      return NextResponse.json({ error: 'Comment content is required.' }, { status: 400 });
    }

    const contentStr = String(content);
    if (contentStr.length > 2000) {
      return NextResponse.json({ error: 'Comment cannot exceed 2000 characters.' }, { status: 400 });
    }

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required.' }, { status: 400 });
    }

    const db = await getDB();
    const commentId = generateId();
    const now = nowISO();

    if (parentId) {
      const parent = await db
        .prepare('SELECT id, isDeleted FROM Comment WHERE id = ?')
        .bind(String(parentId))
        .first();

      if (!parent || toBool(parent.isDeleted as number)) {
        return NextResponse.json({ error: 'Parent comment not found.' }, { status: 404 });
      }
    }

    await db
      .prepare(
        'INSERT INTO Comment (id, content, authorId, parentId, targetId, targetType, isDeleted, isReported, reportCount, likes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(commentId, contentStr.trim(), session.id, parentId ? String(parentId) : null, String(targetId), String(targetType || 'project'), 0, 0, 0, 0, now, now)
      .run();

    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'comment_created',
        `Comment on ${targetType || 'project'}: ${targetId}`,
        ip,
        now
      )
      .run();

    const comment = await db
      .prepare(
        `SELECT c.*, u.nickname, u.avatar, u.role
         FROM Comment c
         LEFT JOIN User u ON c.authorId = u.id
         WHERE c.id = ?`
      )
      .bind(commentId)
      .first();

    // --- Discord notification ---
    // IMPORTANTE: Se usa await porque en Cloudflare Workers el
    // "fire & forget" (async sin await) se muere cuando se
    // envia la respuesta y el worker se termina.
    try {
      let parentAuthorName: string | null = null;
      if (parentId) {
        const parentRow = await db
          .prepare('SELECT u.nickname FROM Comment c LEFT JOIN User u ON c.authorId = u.id WHERE c.id = ?')
          .bind(String(parentId))
          .first();
        parentAuthorName = (parentRow?.nickname as string) || null;
      }

      const targetName = String(targetId);
      const projectNames: Record<string, string> = {
        monika: 'Monika After History',
        natsuki: 'Just Natsuki',
        yuri: 'Just Yuri',
      };
      const projectName = projectNames[targetName] || targetName;

      const siteConfig = await db.prepare('SELECT siteUrl FROM DiscordConfig LIMIT 1').first();
      const siteUrl = (siteConfig?.siteUrl as string) || process.env.SITE_URL || 'https://tu-dominio.pages.dev';

      await notifyNewComment({
        projectName,
        projectId: String(targetId),
        authorNickname: session.nickname,
        authorAvatar: session.avatar,
        authorRole: session.role,
        content: contentStr.trim(),
        siteUrl,
        isReply: !!parentId,
        parentAuthor: parentAuthorName || undefined,
      });
    } catch (notifError) {
      // No fallamos el comentario por un error de notificacion
      console.error('[Discord] Error al enviar notificacion:', notifError);
    }

    return NextResponse.json({
      ...comment,
      isDeleted: false,
      isReported: false,
      author: {
        id: session.id,
        nickname: session.nickname,
        avatar: session.avatar,
        role: session.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE: Soft-delete a comment (moderator+ only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin' && session.role !== 'moderator') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const targetCommentId = body.commentId as string;

    if (!targetCommentId) {
      return NextResponse.json({ error: 'Comment ID is required.' }, { status: 400 });
    }

    const db = await getDB();

    const comment = await db
      .prepare('SELECT id, authorId FROM Comment WHERE id = ? AND isDeleted = 0')
      .bind(targetCommentId)
      .first();

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    await db
      .prepare('UPDATE Comment SET isDeleted = 1, updatedAt = ? WHERE id = ?')
      .bind(nowISO(), targetCommentId)
      .run();

    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'comment_deleted',
        `Deleted comment ${targetCommentId}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        nowISO()
      )
      .run();

    return NextResponse.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
