import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { donations, users } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { generateId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { nickname, amount, currency, platform, message } = await request.json();
    
    const session = await getSession();
    const userId = session?.id || null;

    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    const donation = await db.insert(donations).values({
      id: generateId(),
      userId,
      nickname: nickname || 'Anonymous',
      amount,
      currency: currency || 'USD',
      platform: platform || 'ko-fi',
      message,
      createdAt: now,
    }).returning().get();

    // If user is logged in, give premium
    if (userId && amount >= 10) {
      await db.update(users).set({ isPremium: true, updatedAt: now }).where(eq(users.id, userId));
    }

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    const donationsWithUser = await db.select({
      donation: donations,
      user: { nickname: users.nickname, avatar: users.avatar },
    })
    .from(donations)
    .leftJoin(users, eq(donations.userId, users.id))
    .orderBy(desc(donations.createdAt))
    .limit(50);

    const result = donationsWithUser.map(d => ({
      ...d.donation,
      user: d.user,
    }));

    return NextResponse.json({ donations: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
