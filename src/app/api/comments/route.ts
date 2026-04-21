import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { comments, users, reactions, activityLogs } from '@/drizzle/schema';
import { eq, and, desc, sql, isNull } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { checkRateLimit, generateId } from '@/lib/auth';

// Spam filter keywords
const SPAM_WORDS = ['viagra', 'casino', 'lottery', 'free money', 'click here', 'subscribe', 'buy now', 'http://', 'https://'];

function containsSpam(content: string): boolean {
  const lower = content.toLowerCase();
  return SPAM_WORDS.some(word => lower.includes(word));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType') || 'project';
    
    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    // Fetch top-level comments with author info
    const topComments = await db.select({
      comment: comments,
      author: { id: users.id, nickname: users.nickname, avatar: users.avatar, role: users.role, isPremium: users.isPremium },
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(and(
      eq(comments.targetId, targetId),
      eq(comments.targetType, targetType),
      isNull(comments.parentId),
      eq(comments.isDeleted, false),
    ))
    .orderBy(desc(comments.createdAt));

    // Collect all comment IDs for reaction counts
    const topCommentIds = topComments.map(c => c.comment.id);

    // Get reply IDs
    let allIds = [...topCommentIds];
    if (topCommentIds.length > 0) {
      const replyIdRows = await db.select({ id: comments.id }).from(comments)
        .where(sql`${comments.parentId} IN (${sql.join(topCommentIds.map(id => sql`${id}`), sql`, `)})`);
      allIds = [...allIds, ...replyIdRows.map(r => r.id)];
    }

    // Fetch reaction counts
    let reactionCountMap: Record<string, number> = {};
    if (allIds.length > 0) {
      const reactionCounts = await db.select({
        commentId: reactions.commentId,
        count: sql<number>`count(*)`.as('count'),
      }).from(reactions)
        .where(sql`${reactions.commentId} IN (${sql.join(allIds.map(id => sql`${id}`), sql`, `)})`)
        .groupBy(reactions.commentId);
      reactionCountMap = Object.fromEntries(reactionCounts.map(r => [r.commentId, r.count]));
    }

    // Fetch replies for each top-level comment with author info
    let repliesMap: Record<string, any[]> = {};

    if (topCommentIds.length > 0) {
      const replies = await db.select({
        reply: comments,
        author: { id: users.id, nickname: users.nickname, avatar: users.avatar, role: users.role, isPremium: users.isPremium },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(and(
        sql`${comments.parentId} IN (${sql.join(topCommentIds.map(id => sql`${id}`), sql`, `)})`,
        eq(comments.isDeleted, false),
      ))
      .orderBy(comments.createdAt);

      for (const reply of replies) {
        const pid = reply.reply.parentId!;
        if (!repliesMap[pid]) repliesMap[pid] = [];
        repliesMap[pid].push({
          ...reply.reply,
          author: reply.author,
          _count: { reactions: reactionCountMap[reply.reply.id] || 0 },
        });
      }
    }

    // Build the response matching Prisma's include shape
    const result = topComments.map(c => ({
      ...c.comment,
      author: c.author,
      _count: { reactions: reactionCountMap[c.comment.id] || 0 },
      replies: repliesMap[c.comment.id] || [],
    }));

    return NextResponse.json({ comments: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: 'Too many comments. Please wait.' }, { status: 429 });
    }

    const { content, targetId, targetType, parentId } = await request.json();
    
    if (!content || !targetId) {
      return NextResponse.json({ error: 'Content and targetId are required' }, { status: 400 });
    }

    if (content.length < 1 || content.length > 1000) {
      return NextResponse.json({ error: 'Comment must be 1-1000 characters' }, { status: 400 });
    }

    if (containsSpam(content)) {
      return NextResponse.json({ error: 'Comment contains prohibited content' }, { status: 400 });
    }

    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    const comment = await db.insert(comments).values({
      id: generateId(),
      content,
      authorId: session.id,
      targetId,
      targetType: targetType || 'project',
      parentId: parentId || null,
      isDeleted: false,
      isReported: false,
      reportCount: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    }).returning().get();

    // Fetch author info for the response
    const authorResults = await db.select({
      id: users.id, nickname: users.nickname, avatar: users.avatar, role: users.role, isPremium: users.isPremium,
    }).from(users).where(eq(users.id, session.id)).limit(1);

    const commentWithAuthor = {
      ...comment,
      author: authorResults[0],
    };

    // Log activity
    await db.insert(activityLogs).values({
      id: generateId(),
      userId: session.id,
      action: 'comment',
      details: JSON.stringify({ commentId: comment.id, targetId, targetType }),
      ipAddress: ip,
      createdAt: now,
    });

    return NextResponse.json({ comment: commentWithAuthor });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['moderator', 'admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { commentId } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    await db.update(comments).set({ isDeleted: true, updatedAt: now }).where(eq(comments.id, commentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
