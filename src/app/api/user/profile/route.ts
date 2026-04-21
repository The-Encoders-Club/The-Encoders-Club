export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        isPremium: true,
        locale: true,
        discordLinked: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
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

    const { env } = getRequestContext();
    const db = getDb(env.DB);
    
    if (nickname) {
      const existing = await db.user.findFirst({ where: { nickname, NOT: { id: session.id } } });
      if (existing) {
        return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (nickname) updateData.nickname = nickname;
    if (email !== undefined) updateData.email = email || null;
    if (locale) updateData.locale = locale;
    if (avatar) updateData.avatar = avatar;

    const user = await db.user.update({
      where: { id: session.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { nickname: user.nickname, avatar: user.avatar } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
