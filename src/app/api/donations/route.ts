import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO, toBool } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Create a donation record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { nickname, amount, currency, platform, message } = body;

    if (!nickname || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Nickname and a valid amount are required.' }, { status: 400 });
    }

    const db = await getDB();
    const numAmount = Number(amount);

    // Try to find user by nickname to link donation
    let userId: string | null = null;
    const session = await getSession();

    if (session) {
      userId = session.id;
    } else {
      const user = await db
        .prepare('SELECT id, isPremium FROM User WHERE nickname = ?')
        .bind(String(nickname))
        .first();
      if (user) {
        userId = user.id as string;
      }
    }

    const donationId = generateId();
    const now = nowISO();

    await db
      .prepare(
        'INSERT INTO Donation (id, userId, nickname, amount, currency, platform, message, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        donationId,
        userId,
        String(nickname),
        numAmount,
        currency ? String(currency) : 'USD',
        platform ? String(platform) : 'ko-fi',
        message ? String(message) : null,
        now
      )
      .run();

    // If user is logged in and donation amount >= 10, grant premium
    if (userId && numAmount >= 10) {
      await db
        .prepare('UPDATE User SET isPremium = 1, updatedAt = ? WHERE id = ?')
        .bind(now, userId)
        .run();

      // Notify the user
      await db
        .prepare('INSERT INTO Notification (id, userId, type, title, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          userId,
          'donation',
          'Thank you for your donation! 🎉',
          `Your donation of ${numAmount} ${currency || 'USD'} has been received. You now have premium status!`,
          now
        )
        .run();
    }

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        'donation',
        `Donation of ${numAmount} ${currency || 'USD'} from ${nickname}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    return NextResponse.json({
      id: donationId,
      message: 'Donation recorded successfully.',
    }, { status: 201 });
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// GET: List recent donations (admin+ only)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const db = await getDB();

    const { results: donations } = await db
      .prepare(
        `SELECT d.*, u.nickname as userName, u.avatar as userAvatar
         FROM Donation d
         LEFT JOIN User u ON d.userId = u.id
         ORDER BY d.createdAt DESC
         LIMIT 50`
      )
      .all();

    return NextResponse.json({
      donations: (donations || []).map((d: Record<string, unknown>) => ({
        id: d.id,
        userId: d.userId,
        nickname: d.nickname,
        userName: d.userName,
        userAvatar: d.userAvatar,
        amount: d.amount,
        currency: d.currency,
        platform: d.platform,
        message: d.message,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch donations error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
