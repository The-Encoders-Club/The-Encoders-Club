import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Toggle like on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id: commentId } = await params;

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required.' }, { status: 400 });
    }

    const db = await getDB();

    // Check comment exists and is not deleted
    const comment = await db
      .prepare('SELECT id, likes FROM Comment WHERE id = ? AND isDeleted = 0')
      .bind(commentId)
      .first();

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    // Check if the user already liked this comment
    const existingReaction = await db
      .prepare('SELECT id FROM Reaction WHERE userId = ? AND commentId = ? AND type = ?')
      .bind(session.id, commentId, 'like')
      .first();

    if (existingReaction) {
      // Unlike: remove the reaction and decrement likes using batch for atomicity
      await db.batch([
        db.prepare('DELETE FROM Reaction WHERE id = ?').bind(existingReaction.id as string),
        db.prepare('UPDATE Comment SET likes = MAX(0, likes - 1), updatedAt = ? WHERE id = ?').bind(nowISO(), commentId),
      ]);
      return NextResponse.json({ liked: false, likes: Math.max(0, (comment.likes as number) - 1) });
    } else {
      // Like: create a reaction and increment likes using batch for atomicity
      const reactionId = generateId();
      await db.batch([
        db.prepare('INSERT INTO Reaction (id, type, userId, commentId, createdAt) VALUES (?, ?, ?, ?, ?)').bind(
          reactionId,
          'like',
          session.id,
          commentId,
          nowISO()
        ),
        db.prepare('UPDATE Comment SET likes = likes + 1, updatedAt = ? WHERE id = ?').bind(nowISO(), commentId),
      ]);
      return NextResponse.json({ liked: true, likes: (comment.likes as number) + 1 });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
