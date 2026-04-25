import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Report a comment
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
      .prepare('SELECT id, reportCount FROM Comment WHERE id = ? AND isDeleted = 0')
      .bind(commentId)
      .first();

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }

    const now = nowISO();

    // Increment report count and mark as reported
    await db
      .prepare('UPDATE Comment SET reportCount = reportCount + 1, isReported = 1, updatedAt = ? WHERE id = ?')
      .bind(now, commentId)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'comment_reported',
        `Reported comment ${commentId}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    const newReportCount = (comment.reportCount as number) + 1;

    return NextResponse.json({
      message: 'Comment reported successfully.',
      reportCount: newReportCount,
      isReported: true,
    });
  } catch (error) {
    console.error('Report comment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
