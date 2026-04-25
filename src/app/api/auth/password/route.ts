import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

// POST: Change password (authenticated user)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json() as { currentPassword: string; newPassword: string };
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const db = await getDB();

    const user = await db
      .prepare('SELECT id, passwordHash FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);

    await db
      .prepare('UPDATE User SET passwordHash = ?, updatedAt = ? WHERE id = ?')
      .bind(newHash, nowISO(), session.id)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'password_change',
        'User changed their password',
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        nowISO()
      )
      .run();

    return NextResponse.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT: Reset password by nickname (admin/setup only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { nickname: string; newPassword: string };
    const { nickname, newPassword } = body;

    if (!nickname || !newPassword) {
      return NextResponse.json({ error: 'Nickname and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const db = await getDB();

    const user = await db
      .prepare('SELECT id FROM User WHERE nickname = ?')
      .bind(nickname)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const newHash = await hashPassword(newPassword);

    await db
      .prepare('UPDATE User SET passwordHash = ?, updatedAt = ? WHERE id = ?')
      .bind(newHash, nowISO(), user.id as string)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        user.id as string,
        'password_reset',
        'Password was reset by admin',
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        nowISO()
      )
      .run();

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
