import { NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, comments, donations, activityLogs } from '@/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    const [
      totalUsersResult,
      totalCommentsResult,
      totalDonationsResult,
      recentUsers,
      recentCommentsRaw,
      recentLogsRaw,
      donations,
    ] = await Promise.all([
      // total users count
      db.select({ count: sql<number>`count(*)` }).from(users),
      // total non-deleted comments count
      db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.isDeleted, false)),
      // total donations count
      db.select({ count: sql<number>`count(*)` }).from(donations),
      // recent 10 users
      db.select({ id: users.id, nickname: users.nickname, avatar: users.avatar, role: users.role, createdAt: users.createdAt })
        .from(users).orderBy(desc(users.createdAt)).limit(10),
      // recent 10 comments with author nickname
      db.select({
        id: comments.id,
        content: comments.content,
        targetId: comments.targetId,
        targetType: comments.targetType,
        createdAt: comments.createdAt,
        author: { nickname: users.nickname },
      })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.isDeleted, false))
        .orderBy(desc(comments.createdAt))
        .limit(10),
      // recent 20 activity logs with user nickname
      db.select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        ipAddress: activityLogs.ipAddress,
        createdAt: activityLogs.createdAt,
        user: { nickname: users.nickname },
      })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(20),
      // recent 20 donations
      db.select().from(donations).orderBy(desc(donations.createdAt)).limit(20),
    ]);

    const totalUsers = totalUsersResult[0].count;
    const totalComments = totalCommentsResult[0].count;
    const totalDonations = totalDonationsResult[0].count;

    // usersByRole groupBy
    const usersByRole = await db.select({
      role: users.role,
      count: sql<number>`count(*)`.as('count'),
    }).from(users).groupBy(users.role);

    return NextResponse.json({
      stats: { totalUsers, totalComments, totalDonations },
      recentUsers,
      recentComments: recentCommentsRaw,
      recentLogs: recentLogsRaw,
      donations,
      usersByRole,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
