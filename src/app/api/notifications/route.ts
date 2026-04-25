import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// PUT: Mark notification(s) as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const { id, markAllRead } = body;

    const db = await getDB();

    if (markAllRead) {
      // Mark all unread notifications as read
      await db
        .prepare('UPDATE Notification SET isRead = 1 WHERE userId = ? AND isRead = 0')
        .bind(session.id)
        .run();

      return NextResponse.json({ message: 'All notifications marked as read.' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Notification ID or markAllRead is required.' }, { status: 400 });
    }

    // Mark single notification as read
    const notification = await db
      .prepare('SELECT id FROM Notification WHERE id = ? AND userId = ?')
      .bind(String(id), session.id)
      .first();

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }

    await db
      .prepare('UPDATE Notification SET isRead = 1 WHERE id = ?')
      .bind(String(id))
      .run();

    return NextResponse.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark notification error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
