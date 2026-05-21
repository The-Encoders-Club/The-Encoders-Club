import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDB, nowISO } from '@/lib/db';

// POST: Unlink Discord account
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const db = await getDB();

    // Verify user has Discord linked
    const user = await db
      .prepare('SELECT id, discordId, discordLinked FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    if (!user || !user.discordId) {
      return NextResponse.json({ error: 'Discord is not linked.' }, { status: 400 });
    }

    const now = nowISO();
    const discordId = user.discordId as string;

    // Clear Discord data
    await db
      .prepare('UPDATE User SET discordId = NULL, discordLinked = 0, discordAccessToken = NULL, discordRefreshToken = NULL, updatedAt = ? WHERE id = ?')
      .bind(now, session.id)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'discord_unlinked',
        `Discord account unlinked (was: ${discordId})`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    return NextResponse.json({ message: 'Discord account unlinked successfully.' });
  } catch (error) {
    console.error('Discord unlink error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
