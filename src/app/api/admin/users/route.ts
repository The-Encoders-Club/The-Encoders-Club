import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, comments, activityLogs } from '@/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { generateId } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    // Fetch users
    const allUsers = await db.select({
      id: users.id,
      nickname: users.nickname,
      email: users.email,
      avatar: users.avatar,
      role: users.role,
      isPremium: users.isPremium,
      isBanned: users.isBanned,
      banReason: users.banReason,
      discordLinked: users.discordLinked,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt));

    // Fetch comment counts per user
    const commentCounts = await db.select({
      authorId: comments.authorId,
      _count: sql<number>`count(*)`.as('count'),
    }).from(comments).groupBy(comments.authorId);

    const countMap = Object.fromEntries(commentCounts.map(c => [c.authorId, c._count]));

    const result = allUsers.map(u => ({
      ...u,
      _count: { comments: countMap[u.id] || 0 },
    }));

    return NextResponse.json({ users: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { userId, role, isBanned, banReason } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);

    const targetUserResults = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const targetUser = targetUserResults[0];
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Owner cannot be demoted or banned
    if (targetUser.role === 'owner') {
      return NextResponse.json({ error: 'Cannot modify owner' }, { status: 403 });
    }

    // Non-owners cannot modify other admins (only owner can)
    if (session.role === 'admin' && targetUser.role === 'admin') {
      return NextResponse.json({ error: 'Cannot modify other admins' }, { status: 403 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (role) updateData.role = role;
    if (isBanned !== undefined) {
      updateData.isBanned = isBanned;
      updateData.banReason = isBanned ? banReason || 'No reason specified' : null;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    // Log activity
    await db.insert(activityLogs).values({
      id: generateId(),
      userId: session.id,
      action: 'admin_user_update',
      details: JSON.stringify({ targetUserId: userId, changes: updateData }),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
