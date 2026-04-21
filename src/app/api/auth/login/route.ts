import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, activityLogs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, checkRateLimit } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 10, 300000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { nickname, password, remember } = await request.json();
    
    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password are required' }, { status: 400 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    const userResults = await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
    const user = userResults[0];
    
    if (!user || !await verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account has been suspended' }, { status: 403 });
    }

    // Log activity
    const now = new Date().toISOString();
    await db.insert(activityLogs).values({
      id: (await import('@/lib/auth')).generateId(),
      userId: user.id,
      action: 'login',
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
        locale: user.locale,
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
