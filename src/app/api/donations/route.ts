import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { nickname, amount, currency, platform, message } = await request.json();
    
    const session = await getSession();
    const userId = session?.id || null;

    const donation = await db.donation.create({
      data: {
        userId,
        nickname: nickname || 'Anonymous',
        amount,
        currency: currency || 'USD',
        platform: platform || 'ko-fi',
        message,
      },
    });

    // If user is logged in, give premium
    if (userId && amount >= 10) {
      await db.user.update({ where: { id: userId }, data: { isPremium: true } });
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

    const donations = await db.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { nickname: true, avatar: true } } },
    });

    return NextResponse.json({ donations });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
