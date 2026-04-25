import { NextResponse } from 'next/server';
import { getDB, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Dashboard stats (admin+ only)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    if (!['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const db = await getDB();

    // Total counts
    const [totalUsers, totalComments, totalDonations] = await Promise.all([
      db.prepare('SELECT COUNT(*) as c FROM User').first(),
      db.prepare('SELECT COUNT(*) as c FROM Comment WHERE isDeleted = 0').first(),
      db.prepare('SELECT COUNT(*) as c FROM Donation').first(),
    ]);

    // Recent users (last 10)
    const { results: recentUsers } = await db
      .prepare(
        'SELECT id, nickname, email, avatar, role, isPremium, isBanned, createdAt FROM User ORDER BY createdAt DESC LIMIT 10'
      )
      .all();

    // Recent comments (last 10) - format to match frontend expectations
    const { results: recentComments } = await db
      .prepare(
        `SELECT c.id, c.content, c.authorId, c.targetId, c.targetType, c.likes, c.isReported, c.reportCount as reports, c.createdAt,
                u.nickname, u.avatar, u.role
         FROM Comment c
         LEFT JOIN User u ON c.authorId = u.id
         WHERE c.isDeleted = 0
         ORDER BY c.createdAt DESC
         LIMIT 10`
      )
      .all();

    // Recent activity logs (last 20)
    const { results: recentLogs } = await db
      .prepare(
        `SELECT a.id, a.userId, a.action, a.details, a.ipAddress, a.createdAt,
                u.nickname
         FROM ActivityLog a
         LEFT JOIN User u ON a.userId = u.id
         ORDER BY a.createdAt DESC
         LIMIT 20`
      )
      .all();

    // Recent donations (last 20)
    const { results: donations } = await db
      .prepare(
        `SELECT d.id, d.userId, d.nickname, d.amount, d.currency, d.platform, d.message, d.createdAt,
                u.nickname as userNickname, u.avatar as userAvatar
         FROM Donation d
         LEFT JOIN User u ON d.userId = u.id
         ORDER BY d.createdAt DESC
         LIMIT 20`
      )
      .all();

    // Users by role - format to match frontend { role, _count: N }
    const { results: roleGroups } = await db
      .prepare('SELECT role, COUNT(*) as cnt FROM User GROUP BY role')
      .all();

    const usersByRole = (roleGroups || []).map((r: any) => ({
      role: r.role,
      _count: r.cnt,
    }));

    return NextResponse.json({
      stats: {
        totalUsers: (totalUsers?.c as number) || 0,
        totalComments: (totalComments?.c as number) || 0,
        totalDonations: (totalDonations?.c as number) || 0,
      },
      recentUsers: (recentUsers || []).map((u: any) => ({
        id: u.id,
        nickname: u.nickname,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        isPremium: toBool(u.isPremium),
        isBanned: toBool(u.isBanned),
        createdAt: u.createdAt,
      })),
      recentComments: (recentComments || []).map((c: any) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        isDeleted: false,
        reports: c.reports || 0,
        author: {
          nickname: c.nickname,
          avatar: c.avatar,
        },
      })),
      recentLogs: (recentLogs || []).map((a: any) => ({
        id: a.id,
        action: a.action,
        details: a.details,
        createdAt: a.createdAt,
        user: a.nickname ? { nickname: a.nickname } : null,
      })),
      donations: (donations || []).map((d: any) => ({
        id: d.id,
        amount: d.amount,
        currency: d.currency,
        message: d.message,
        createdAt: d.createdAt,
      })),
      usersByRole,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
