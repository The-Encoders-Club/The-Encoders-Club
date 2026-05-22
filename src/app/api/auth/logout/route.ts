import { NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/session';
import { notifyUserLogout } from '@/lib/discord-notification';
import { getDB } from '@/lib/db';

export async function POST() {
  try {
    // Get user info BEFORE destroying session
    const session = await getSession();
    let nickname: string | undefined;
    let avatar: string | null | undefined;
    let role: string | undefined;

    if (session) {
      nickname = session.nickname;
      avatar = session.avatar;
      role = session.role;
    }

    // Destroy session
    await destroySession();

    // Send Discord notification (await to ensure it sends before response)
    if (nickname) {
      try {
        const db = await getDB();
        const siteConfig = await db.prepare('SELECT siteUrl FROM DiscordConfig LIMIT 1').first();
        const siteUrl = (siteConfig?.siteUrl as string) || undefined;
        await notifyUserLogout({ nickname, avatar: avatar || null, role, siteUrl });
      } catch (notifErr) {
        console.error('[Logout] Discord notification error:', notifErr);
      }
    }

    return NextResponse.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
