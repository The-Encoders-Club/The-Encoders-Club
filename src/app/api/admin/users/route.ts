export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const users = await db.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        isPremium: true,
        isBanned: true,
        banReason: true,
        discordLinked: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
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

    const { env } = getRequestContext();
    const db = getDb(env.DB);
    
    const targetUser = await db.user.findUnique({ where: { id: userId } });
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

    const updateData: any = {};
    if (role) updateData.role = role;
    if (isBanned !== undefined) {
      updateData.isBanned = isBanned;
      updateData.banReason = isBanned ? banReason || 'No reason specified' : null;
    }

    await db.user.update({ where: { id: userId }, data: updateData });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: session.id,
        action: 'admin_user_update',
        details: JSON.stringify({ targetUserId: userId, changes: updateData }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
