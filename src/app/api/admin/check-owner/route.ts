import { NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// Check if an owner already exists
export async function GET() {
  try {
    const d1 = getD1();
    const db = getDb(d1);

    const ownerResults = await db.select({ id: users.id, nickname: users.nickname })
      .from(users).where(eq(users.role, 'owner')).limit(1);
    const owner = ownerResults[0];
    return NextResponse.json({ ownerExists: !!owner, ownerNickname: owner?.nickname || null });
  } catch {
    return NextResponse.json({ ownerExists: false, ownerNickname: null });
  }
}
