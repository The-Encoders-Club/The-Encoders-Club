import { NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/session';
import { notifyUserLogout } from '@/lib/discord-notification';

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

    // Send Discord notification (fire-and-forget)
    if (nickname) {
      notifyUserLogout({ nickname, avatar: avatar || null, role }).catch(() => {});
    }

    return NextResponse.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
