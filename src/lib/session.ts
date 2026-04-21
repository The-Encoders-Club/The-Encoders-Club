import { cookies } from 'next/headers';
import { getD1, getDb } from './db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from './auth';

export interface SessionUser {
  id: string;
  nickname: string;
  email: string | null;
  avatar: string | null;
  role: string;
  isPremium: boolean;
  locale: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  const rememberToken = cookieStore.get('remember_token')?.value;

  if (!sessionId && !rememberToken) return null;

  try {
    const d1 = getD1();
    const db = getDb(d1);

    let user;
    if (rememberToken) {
      const results = await db.select().from(users).where(eq(users.rememberToken, rememberToken)).limit(1);
      user = results[0];
    } else if (sessionId) {
      const results = await db.select().from(users).where(eq(users.id, sessionId)).limit(1);
      user = results[0];
    }

    if (!user || user.isBanned) return null;

    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isPremium: user.isPremium,
      locale: user.locale,
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, remember: boolean = false): Promise<void> {
  const cookieStore = await cookies();

  if (remember) {
    const token = (await import('./auth')).generateRememberToken();
    const d1 = getD1();
    const db = getDb(d1);
    await db.update(users).set({ rememberToken: token }).where(eq(users.id, userId));
    cookieStore.set('remember_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }

  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: remember ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year or 1 day
    path: '/',
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('remember_token');
}
