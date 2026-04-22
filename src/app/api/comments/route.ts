import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { checkRateLimit } from '@/lib/auth';

// Spam filter keywords
const SPAM_WORDS = ['viagra', 'casino', 'lottery', 'free money', 'click here', 'subscribe', 'buy now', 'http://', 'https://'];

function containsSpam(content: string): boolean {
  const lower = content.toLowerCase();
  return SPAM_WORDS.some(word => lower.includes(word));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType') || 'project';
    
    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: {
        targetId,
        targetType,
        parentId: null,
        isDeleted: false,
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true, role: true, isPremium: true } },
        replies: {
          where: { isDeleted: false },
          include: {
            author: { select: { id: true, nickname: true, avatar: true, role: true, isPremium: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: 'Too many comments. Please wait.' }, { status: 429 });
    }

    const { content, targetId, targetType, parentId } = await request.json();
    
    if (!content || !targetId) {
      return NextResponse.json({ error: 'Content and targetId are required' }, { status: 400 });
    }

    if (content.length < 1 || content.length > 1000) {
      return NextResponse.json({ error: 'Comment must be 1-1000 characters' }, { status: 400 });
    }

    if (containsSpam(content)) {
      return NextResponse.json({ error: 'Comment contains prohibited content' }, { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        content,
        authorId: session.id,
        targetId,
        targetType: targetType || 'project',
        parentId: parentId || null,
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true, role: true, isPremium: true } },
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: session.id,
        action: 'comment',
        details: JSON.stringify({ commentId: comment.id, targetId, targetType }),
        ipAddress: ip,
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['moderator', 'admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { commentId } = await request.json();
    
    await db.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
