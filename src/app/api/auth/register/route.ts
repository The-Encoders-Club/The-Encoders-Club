export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';
import { hashPassword, isValidNickname, isValidPassword, checkRateLimit } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { getServerLocale } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 300000)) { // 5 requests per 5 minutes
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { nickname, email, password, confirmPassword, remember, locale } = await request.json();
    
    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password are required' }, { status: 400 });
    }
    
    if (!isValidNickname(nickname)) {
      return NextResponse.json({ error: 'Nickname must be 3-20 characters (letters, numbers, underscores)' }, { status: 400 });
    }
    
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const existingUser = await db.user.findUnique({ where: { nickname } });
    if (existingUser) {
      return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userLocale = getServerLocale(request.headers);
    
    const user = await db.user.create({
      data: {
        nickname,
        email: null,
        passwordHash,
        locale: locale || userLocale,
        avatar: null,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'register',
        details: JSON.stringify({ nickname }),
        ipAddress: ip,
      },
    });

    await createSession(user.id, remember || false);

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        nickname: user.nickname, 
        role: user.role,
        avatar: user.avatar,
        isPremium: user.isPremium,
      } 
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
