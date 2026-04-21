import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { reactions, comments } from '@/drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { generateId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const d1 = getD1();
    const db = getDb(d1);

    // Check if reaction already exists
    const existing = await db.select().from(reactions)
      .where(and(
        eq(reactions.userId, session.id),
        eq(reactions.commentId, id),
        eq(reactions.type, 'like'),
      ))
      .limit(1);

    if (existing[0]) {
      // Unlike: remove reaction and decrement likes
      await db.delete(reactions).where(eq(reactions.id, existing[0].id));
      await db.run(sql`UPDATE comments SET likes = MAX(likes - 1, 0) WHERE id = ${id}`);
      return NextResponse.json({ liked: false });
    } else {
      // Like: add reaction and increment likes
      await db.insert(reactions).values({
        id: generateId(),
        type: 'like',
        userId: session.id,
        commentId: id,
        createdAt: new Date().toISOString(),
      });
      await db.run(sql`UPDATE comments SET likes = likes + 1 WHERE id = ${id}`);
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
