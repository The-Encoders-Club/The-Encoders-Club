import { cookies } from 'next/headers';
import { createDb } from './db';

export interface SessionUser {
  id: string;
  nickname: string;
  email: string | null;
  avatar: string | null;
  role: string;
  isPremium: boolean;
  locale: string;
}

/**
 * Determina si estamos en un entorno de producción.
 *
 * En Cloudflare Workers, `process.env.NODE_ENV` puede no estar
 * disponible de forma fiable (depende de `nodejs_compat` y de que
 * la variable esté declarada en `[vars]`). Como los Workers siempre
 * se sirven sobre HTTPS, es más seguro comprobarlo indirectamente:
 * si NO estamos en un `next dev` local, asumimos producción.
 */
function isProduction(): boolean {
  try {
    // Con nodejs_compat y wrangler.toml [vars] esto funciona
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
      return true;
    }
  } catch {
    // process no disponible — probablemente edge runtime puro
  }
  // En Cloudflare Workers todo es producción (siempre HTTPS)
  // Si no hay process.env, asumimos producción
  return typeof process === 'undefined' || typeof process.env === 'undefined'
    ? true
    : false;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  const rememberToken = cookieStore.get('remember_token')?.value;
  
  if (!sessionId && !rememberToken) return null;
  
  try {
    const db = createDb();
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
  const secure = isProduction();
  
  if (remember) {
    const { generateRememberToken } = await import('./auth');
    const token = generateRememberToken();
    const db = createDb();
    await db.user.update({ where: { id: userId }, data: { rememberToken: token } });
    cookieStore.set('remember_token', token, { 
      httpOnly: true, 
      secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/' 
    });
  }
  
  cookieStore.set('session', userId, { 
    httpOnly: true, 
    secure,
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
