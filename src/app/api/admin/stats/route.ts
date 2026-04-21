export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const [
      totalUsers,
      totalComments,
      totalDonations,
      recentUsers,
      recentComments,
      recentLogs,
      donations,
    ] = await Promise.all([
      db.user.count(),
      db.comment.count({ where: { isDeleted: false } }),
      db.donation.count(),
      db.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, nickname: true, avatar: true, role: true, createdAt: true } }),
      db.comment.findMany({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, take: 10, include: { author: { select: { nickname: true } } } }),
      db.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { nickname: true } } } }),
      db.donation.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    ]);

    const usersByRole = await db.user.groupBy({ by: ['role'], _count: true });

    return NextResponse.json({
      stats: { totalUsers, totalComments, totalDonations },
      recentUsers,
      recentComments,
      recentLogs,
      donations,
      usersByRole,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
