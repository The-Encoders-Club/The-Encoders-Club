import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, toBool } from '@/lib/db';
import { verifyPassword, checkRateLimit } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 10, 60000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as { nickname: string; password: string; remember?: boolean };
    const { nickname, password } = body;

    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password are required.' }, { status: 400 });
    }

    const db = await getDB();

    const user = await db
      .prepare('SELECT * FROM User WHERE nickname = ?')
      .bind(nickname)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    if (toBool(user.isBanned as number)) {
      return NextResponse.json({ error: 'This account has been banned.', banReason: user.banReason }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const remember = body.remember === true;
    await createSession(user.id as string, remember);

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        user.id as string,
        'login',
        'User logged in',
        ip,
        nowISO()
      )
      .run();

    // Update last login timestamp
    await db
      .prepare("UPDATE User SET updatedAt = ? WHERE id = ?")
      .bind(nowISO(), user.id as string)
      .run();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isPremium: toBool(user.isPremium as number),
        locale: user.locale,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
