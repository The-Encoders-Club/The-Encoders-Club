import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, comments } from '@/drizzle/schema';
import { eq, and, desc, sql, not } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    const userResults = await db.select({
      id: users.id,
      nickname: users.nickname,
      email: users.email,
      avatar: users.avatar,
      role: users.role,
      isPremium: users.isPremium,
      locale: users.locale,
      discordLinked: users.discordLinked,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, session.id)).limit(1);

    const user = userResults[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get comment count
    const commentCountResult = await db.select({ count: sql<number>`count(*)` })
      .from(comments).where(eq(comments.authorId, session.id));

    return NextResponse.json({
      user: {
        ...user,
        _count: { comments: commentCountResult[0].count },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { nickname, email, locale, avatar } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);

    if (nickname) {
      const existing = await db.select().from(users)
        .where(and(eq(users.nickname, nickname), not(eq(users.id, session.id))))
        .limit(1);
      if (existing[0]) {
        return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
      }
    }

    const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (nickname) updateData.nickname = nickname;
    if (email !== undefined) updateData.email = email || null;
    if (locale) updateData.locale = locale;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await db.update(users).set(updateData).where(eq(users.id, session.id)).returning().get();

    return NextResponse.json({ success: true, user: { nickname: updatedUser.nickname, avatar: updatedUser.avatar } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
