import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, toBool, fromBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: List all users with comment count (admin+ only)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const db = await getDB();

    const { results: users } = await db
      .prepare(
        `SELECT u.*, COUNT(c.id) as commentCount
         FROM User u
         LEFT JOIN Comment c ON u.id = c.authorId AND c.isDeleted = 0
         GROUP BY u.id
         ORDER BY u.createdAt DESC`
      )
      .all();

    return NextResponse.json({
      users: (users || []).map((u: Record<string, unknown>) => ({
        id: u.id,
        nickname: u.nickname,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        isPremium: toBool(u.isPremium as number),
        isBanned: toBool(u.isBanned as number),
        banReason: u.banReason,
        discordId: u.discordId,
        discordLinked: toBool(u.discordLinked as number),
        locale: u.locale,
        commentCount: u.commentCount,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT: Update user role/ban status (admin+ only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const { userId, role, isBanned, banReason } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const userIdStr = String(userId);
    const db = await getDB();

    // Get the target user
    const targetUser = await db
      .prepare('SELECT id, role FROM User WHERE id = ?')
      .bind(userIdStr)
      .first();

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Cannot modify owner
    if (targetUser.role === 'owner') {
      return NextResponse.json({ error: 'Cannot modify the owner account.' }, { status: 403 });
    }

    // Admins cannot modify other admins (only owner can)
    if (session.role === 'admin' && targetUser.role === 'admin') {
      return NextResponse.json({ error: 'Admins cannot modify other admin accounts.' }, { status: 403 });
    }

    // Validate role if provided
    const validRoles = ['user', 'moderator', 'admin', 'collaborator'];
    if (role !== undefined && !validRoles.includes(String(role))) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    const now = nowISO();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (role !== undefined) {
      updates.push('role = ?');
      values.push(String(role));
    }

    if (isBanned !== undefined) {
      updates.push('isBanned = ?');
      values.push(fromBool(Boolean(isBanned)));

      if (isBanned && banReason) {
        updates.push('banReason = ?');
        values.push(String(banReason));
      } else if (!isBanned) {
        updates.push('banReason = ?');
        values.push(null);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(userIdStr);

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
        'admin_user_updated',
        `Updated user ${userIdStr}: ${updates.join(', ')}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    // Notify the target user about changes
    const notifMessages: string[] = [];
    if (role !== undefined) notifMessages.push(`Your role has been changed to ${role}`);
    if (isBanned === true) notifMessages.push('Your account has been banned');
    if (isBanned === false) notifMessages.push('Your account has been unbanned');

    if (notifMessages.length > 0) {
      await db
        .prepare('INSERT INTO Notification (id, userId, type, title, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          userIdStr,
          'admin_action',
          'Account Update',
          notifMessages.join('. ') + '.',
          now
        )
        .run();
    }

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update user admin error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
