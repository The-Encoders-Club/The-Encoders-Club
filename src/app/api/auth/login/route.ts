import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
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

    const db = createDb();
    const user = await db.user.findUnique({ where: { nickname } });

    // verifyPassword is now async (uses Web Crypto API)
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Account has been suspended' }, { status: 403 });
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'login',
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
        locale: user.locale,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
