import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    
    const existing = await db.reaction.findUnique({
      where: { userId_commentId_type: { userId: session.id, commentId: id, type: 'like' } },
    });

    if (existing) {
      await db.reaction.delete({ where: { id: existing.id } });
      await db.comment.update({ where: { id }, data: { likes: { decrement: 1 } } });
      return NextResponse.json({ liked: false });
    } else {
      await db.reaction.create({
        data: { userId: session.id, commentId: id, type: 'like' },
      });
      await db.comment.update({ where: { id }, data: { likes: { increment: 1 } } });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
