// ============================================================
// Session Management - Cloudflare Workers Compatible
// Uses next/headers cookies (supported by @opennextjs/cloudflare)
// ============================================================

import { cookies } from 'next/headers';
import { getDB, toBool } from './db';
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
    const db = await getDB();
    let user;

    if (rememberToken) {
      user = await db
        .prepare('SELECT id, nickname, email, avatar, role, isPremium, isBanned, locale FROM User WHERE rememberToken = ?')
        .bind(rememberToken)
        .first();
    } else if (sessionId) {
      user = await db
        .prepare('SELECT id, nickname, email, avatar, role, isPremium, isBanned, locale FROM User WHERE id = ?')
        .bind(sessionId)
        .first();
    }

    if (!user || toBool(user.isBanned)) return null;

    return {
      id: user.id as string,
      nickname: user.nickname as string,
      email: user.email as string | null,
      avatar: user.avatar as string | null,
      role: user.role as string,
      isPremium: toBool(user.isPremium as number),
      locale: user.locale as string,
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, remember: boolean = false): Promise<void> {
  const cookieStore = await cookies();
  const { generateRememberToken } = await import('./auth');

  if (remember) {
    const token = generateRememberToken();
    const db = await getDB();
    await db
      .prepare('UPDATE User SET rememberToken = ? WHERE id = ?')
      .bind(token, userId)
      .run();

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
