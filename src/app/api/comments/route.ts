import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO, toBool } from '@/lib/db';
import { checkRateLimit } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { notifyNewComment } from '@/lib/discord-notification';

// GET: Fetch comments by targetId and targetType with pagination and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType') || 'project';

    // Pagination
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = Math.min(Math.max(parseInt(limitParam || '5', 10) || 5, 1), 100);
    const offset = Math.max(parseInt(offsetParam || '0', 10) || 0, 0);

    // Sorting
    const sort = searchParams.get('sort') || 'newest';
    const validSorts = ['newest', 'oldest', 'most_liked'];
    const sortDir = validSorts.includes(sort) ? sort : 'newest';

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required.' }, { status: 400 });
    }

    const db = await getDB();

    // Build ORDER BY clause based on sort parameter
    let orderBy: string;
    switch (sortDir) {
      case 'oldest':
        orderBy = 'ORDER BY c.createdAt ASC';
        break;
      case 'most_liked':
        orderBy = 'ORDER BY c.likes DESC, c.createdAt DESC';
        break;
      case 'newest':
      default:
        orderBy = 'ORDER BY c.createdAt DESC';
        break;
    }

    // Count total top-level comments
    const countRow = await db
      .prepare(
        'SELECT COUNT(*) as total FROM Comment WHERE targetId = ? AND targetType = ? AND isDeleted = 0 AND parentId IS NULL'
      )
      .bind(targetId, targetType)
      .first<{ total: number }>();

    const total = countRow?.total ?? 0;

    // Fetch top-level comments (not replies) for the target with pagination
    const { results: comments } = await db
      .prepare(
        `SELECT c.*, u.nickname, u.avatar, u.role, u.isPremium
         FROM Comment c
         LEFT JOIN User u ON c.authorId = u.id
         WHERE c.targetId = ? AND c.targetType = ? AND c.isDeleted = 0 AND c.parentId IS NULL
         ${orderBy}
         LIMIT ? OFFSET ?`
      )
      .bind(targetId, targetType, limit, offset)
      .all();

    // Fetch all replies for these comments
    const commentIds = (comments || []).map((c: Record<string, unknown>) => c.id as string);
    let replies: Record<string, unknown>[] = [];

    if (commentIds.length > 0) {
      const placeholders = commentIds.map(() => '?').join(',');
      const { results: replyResults } = await db
        .prepare(
          `SELECT c.*, u.nickname, u.avatar, u.role, u.isPremium
           FROM Comment c
           LEFT JOIN User u ON c.authorId = u.id
           WHERE c.parentId IN (${placeholders}) AND c.isDeleted = 0
           ORDER BY c.createdAt ASC`
        )
        .bind(...commentIds)
        .all();
      replies = (replyResults || []) as Record<string, unknown>[];
    }

    // Attach replies to their parent comments
    const commentsWithReplies = (comments || []).map((comment: Record<string, unknown>) => ({
      ...comment,
      isDeleted: toBool(comment.isDeleted as number),
      isReported: toBool(comment.isReported as number),
      author: {
        id: comment.authorId,
        nickname: comment.nickname,
        avatar: comment.avatar,
        role: comment.role,
        isPremium: toBool(comment.isPremium as number),
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
          isPremium: toBool(reply.isPremium as number),
        },
      })),
    }));

    return NextResponse.json({ comments: commentsWithReplies, total });
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

    // If this is a reply, verify the parent comment exists
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

    // Log activity
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

    // Fetch the created comment with author info
    const comment = await db
      .prepare(
        `SELECT c.*, u.nickname, u.avatar, u.role
         FROM Comment c
         LEFT JOIN User u ON c.authorId = u.id
         WHERE c.id = ?`
      )
      .bind(commentId)
      .first();

    // =====================================================
    // Send Discord notification — fully awaited before response
    // =====================================================
    try {
      console.log('[Comments] === Starting Discord notification ===');

      // 1) Read Discord config from DB (same DB connection, no extra getDB call)
      let discordWebhookUrl: string | null = null;
      let notificationsEnabled = true;

      try {
        const dcConfig = await db
          .prepare('SELECT webhookUrl, notificationEnabled FROM DiscordConfig LIMIT 1')
          .first();

        if (dcConfig) {
          discordWebhookUrl = dcConfig.webhookUrl as string | null;
          // notificationEnabled might not exist as column — handle gracefully
          if (dcConfig.notificationEnabled !== undefined && dcConfig.notificationEnabled !== null) {
            notificationsEnabled = dcConfig.notificationEnabled !== 0;
          }
        }
      } catch (configErr) {
        // Column might not exist — fallback to webhookUrl only
        console.warn('[Comments] Could not read notificationEnabled, trying webhookUrl only:', configErr);
        try {
          const fallback = await db
            .prepare('SELECT webhookUrl FROM DiscordConfig LIMIT 1')
            .first();
          discordWebhookUrl = (fallback?.webhookUrl as string) || null;
        } catch {
          // Both queries failed — config table might be empty
        }
      }

      console.log('[Comments] Discord config:', {
        hasWebhookUrl: !!discordWebhookUrl,
        notificationsEnabled,
      });

      if (!discordWebhookUrl) {
        console.log('[Comments] No webhookUrl configured — skipping notification.');
      } else if (!notificationsEnabled) {
        console.log('[Comments] Notifications are disabled — skipping.');
      } else {
        // 2) Get parent comment info if this is a reply (author + content)
        let parentAuthorName: string | null = null;
        let parentContent: string | null = null;
        if (parentId) {
          try {
            const parentRow = await db
              .prepare(`SELECT c.content, u.nickname FROM Comment c LEFT JOIN User u ON c.authorId = u.id WHERE c.id = ?`)
              .bind(String(parentId))
              .first();
            parentAuthorName = (parentRow?.nickname as string) || null;
            parentContent = (parentRow?.content as string) || null;
          } catch (err) {
            console.warn('[Comments] Could not fetch parent comment:', err);
          }
        }

        // 3) Get project name
        const targetName = String(targetId);
        const projectNames: Record<string, string> = {
          monika: 'Monika After History',
          natsuki: 'Just Natsuki',
          yuri: 'Just Yuri',
        };
        const projectName = projectNames[targetName] || targetName;

        // 4) Get site URL
        let siteUrl = 'https://tu-dominio.pages.dev';
        try {
          const siteConfig = await db.prepare('SELECT siteUrl FROM DiscordConfig LIMIT 1').first();
          if (siteConfig?.siteUrl) {
            siteUrl = String(siteConfig.siteUrl);
          }
        } catch {}

        console.log('[Comments] Sending notification:', {
          projectName,
          author: session.nickname,
          isReply: !!parentId,
          parentAuthor: parentAuthorName,
          contentLen: contentStr.trim().length,
        });

        // 5) Send the notification (fully awaited)
        const notifResult = await notifyNewComment({
          projectName,
          projectId: targetName,
          authorNickname: session.nickname,
          authorAvatar: session.avatar,
          authorRole: session.role,
          content: contentStr.trim(),
          siteUrl,
          isReply: !!parentId,
          parentAuthor: parentAuthorName || undefined,
          parentContent: parentContent || undefined,
        });

        console.log('[Comments] Notification result:', notifResult ? 'SUCCESS' : 'FAILED');
      }
    } catch (notifError) {
      // Log the error but do NOT fail the comment creation
      console.error('[Comments] Discord notification threw exception:', notifError);
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

// DELETE: Soft-delete a comment (moderator+ OR own comment author)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
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
      .first<{ id: string; authorId: string }>();

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    // Allow deletion if user is the comment author OR has moderator+ role
    const isAuthor = session.id === comment.authorId;
    const hasModeratorRole = session.role === 'owner' || session.role === 'admin' || session.role === 'moderator';

    if (!isAuthor && !hasModeratorRole) {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    await db
      .prepare('UPDATE Comment SET isDeleted = 1, updatedAt = ? WHERE id = ?')
      .bind(nowISO(), targetCommentId)
      .run();

    // Log activity (different action depending on whether it's self-delete or moderator action)
    const action = isAuthor && !hasModeratorRole ? 'comment_self_deleted' : 'comment_deleted';
    const details = isAuthor && !hasModeratorRole
      ? `Self-deleted own comment ${targetCommentId}`
      : `Deleted comment ${targetCommentId}`;

    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        action,
        details,
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
