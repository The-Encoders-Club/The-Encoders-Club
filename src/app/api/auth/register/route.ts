import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, activityLogs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, isValidNickname, isValidPassword, checkRateLimit, generateId } from '@/lib/auth';
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

    const d1 = getD1();
    const db = getDb(d1);

    const existingUser = await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
    if (existingUser[0]) {
      return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userLocale = getServerLocale(request.headers);
    const now = new Date().toISOString();
    
    const user = await db.insert(users).values({
      id: generateId(),
      nickname,
      email: null,
      passwordHash,
      locale: locale || userLocale,
      avatar: null,
      role: 'user',
      isPremium: false,
      isBanned: false,
      createdAt: now,
      updatedAt: now,
    }).returning().get();

    // Log activity
    await db.insert(activityLogs).values({
      id: generateId(),
      userId: user.id,
      action: 'register',
      details: JSON.stringify({ nickname }),
      ipAddress: ip,
      createdAt: now,
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
