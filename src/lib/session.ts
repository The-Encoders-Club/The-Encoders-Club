import { cookies } from 'next/headers';
import { db } from './db';
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
    let user;
    if (rememberToken) {
      user = await db.user.findUnique({ where: { rememberToken } });
    } else if (sessionId) {
      // For session-based auth, we store userId in session cookie
      user = await db.user.findUnique({ where: { id: sessionId } });
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
    await db.user.update({ where: { id: userId }, data: { rememberToken: token } });
    cookieStore.set('remember_token', token, { 
      httpOnly: true, 
      secure: false, // set to true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/' 
    });
  }
  
  cookieStore.set('session', userId, { 
    httpOnly: true, 
    secure: false,
    sameSite: 'lax',
    maxAge: remember ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year or 1 day
    path: '/' 
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('remember_token');
}
