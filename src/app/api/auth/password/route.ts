import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, checkRateLimit, generateId } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);

    const userResults = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
    const user = userResults[0];
    if (!user || !await verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    const now = new Date().toISOString();
    await db.update(users).set({ passwordHash, updatedAt: now }).where(eq(users.id, session.id));

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

    const d1 = getD1();
    const db = getDb(d1);

    const userResults = await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
    const user = userResults[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordHash = await hashPassword(newPassword);
    const now = new Date().toISOString();
    await db.update(users).set({ passwordHash, updatedAt: now }).where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
