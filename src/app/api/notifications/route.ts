import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { notifications } from '@/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    const d1 = getD1();
    const db = getDb(d1);

    const [notificationList, unreadResult] = await Promise.all([
      db.select().from(notifications)
        .where(eq(notifications.userId, session.id))
        .orderBy(desc(notifications.createdAt))
        .limit(50),
      db.select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(and(eq(notifications.userId, session.id), eq(notifications.isRead, false))),
    ]);

    const unreadCount = unreadResult[0].count;

    return NextResponse.json({ notifications: notificationList, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { notificationId, markAllRead } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);

    if (markAllRead) {
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.userId, session.id), eq(notifications.isRead, false)));
    } else if (notificationId) {
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
