export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';
import { hashPassword, verifyPassword, checkRateLimit } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const user = await db.user.findUnique({ where: { id: session.id } });
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    await db.user.update({
      where: { id: session.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Recovery endpoint - set new password (simplified - in production use email tokens)
export async function PUT(request: NextRequest) {
  try {
    const { nickname, newPassword } = await request.json();
    
    if (!nickname || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const user = await db.user.findUnique({ where: { nickname } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
