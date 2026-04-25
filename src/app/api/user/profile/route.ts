import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Get current user's full profile with comment count
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const db = await getDB();

    const user = await db
      .prepare('SELECT * FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Get comment count
    const commentCountRow = await db
      .prepare('SELECT COUNT(*) as count FROM Comment WHERE authorId = ? AND isDeleted = 0')
      .bind(session.id)
      .first();

    const commentCount = (commentCountRow?.count as number) || 0;

    return NextResponse.json({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isPremium: toBool(user.isPremium as number),
      isBanned: toBool(user.isBanned as number),
      banReason: user.banReason,
      discordId: user.discordId,
      discordLinked: toBool(user.discordLinked as number),
      locale: user.locale,
      commentCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT: Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const { nickname, email, locale, avatar } = body;

    const db = await getDB();

    // Check nickname uniqueness if being changed
    if (nickname && nickname !== session.nickname) {
      const existing = await db
        .prepare('SELECT id FROM User WHERE nickname = ? AND id != ?')
        .bind(String(nickname), session.id)
        .first();

      if (existing) {
        return NextResponse.json({ error: 'This nickname is already taken.' }, { status: 409 });
      }
    }

    // Check email uniqueness if being changed
    if (email && email !== session.email) {
      const existingEmail = await db
        .prepare('SELECT id FROM User WHERE email = ? AND id != ?')
        .bind(String(email), session.id)
        .first();

      if (existingEmail) {
        return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
      }
    }

    const now = nowISO();

    // Build dynamic update query
    const updates: string[] = [];
    const values: unknown[] = [];

    if (nickname !== undefined) {
      updates.push('nickname = ?');
      values.push(String(nickname));
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email ? String(email) : null);
    }
    if (locale !== undefined) {
      updates.push('locale = ?');
      values.push(String(locale));
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar ? String(avatar) : null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(session.id);

    await db
      .prepare(`UPDATE User SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'profile_updated',
        `Updated profile: ${updates.join(', ')}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    // Return updated profile
    const updatedUser = await db
      .prepare('SELECT id, nickname, email, avatar, role, isPremium, locale, updatedAt FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    return NextResponse.json({
      id: updatedUser!.id,
      nickname: updatedUser!.nickname,
      email: updatedUser!.email,
      avatar: updatedUser!.avatar,
      role: updatedUser!.role,
      isPremium: toBool(updatedUser!.isPremium as number),
      locale: updatedUser!.locale,
      updatedAt: updatedUser!.updatedAt,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
