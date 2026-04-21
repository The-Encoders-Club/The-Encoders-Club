import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, activityLogs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateId } from '@/lib/auth';

// Run once to create the owner account
// POST with { nickname, password } to create owner
export async function POST(request: NextRequest) {
  try {
    const d1 = getD1();
    const db = getDb(d1);

    const existingOwner = await db.select().from(users).where(eq(users.role, 'owner')).limit(1);
    if (existingOwner[0]) {
      return NextResponse.json({ error: 'Owner already exists' }, { status: 400 });
    }

    const { nickname, password } = await request.json();
    
    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password required' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    const user = await db.insert(users).values({
      id: generateId(),
      nickname,
      passwordHash,
      role: 'owner',
      avatar: null,
      isPremium: false,
      isBanned: false,
      locale: 'es',
      createdAt: now,
      updatedAt: now,
    }).returning().get();

    await db.insert(activityLogs).values({
      id: generateId(),
      userId: user.id,
      action: 'owner_created',
      details: 'Owner account created via seed',
      createdAt: now,
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
