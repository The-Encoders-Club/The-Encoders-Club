import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// Run once to create the owner account
// POST with { nickname, password } to create owner
export async function POST(request: NextRequest) {
  try {
    const existingOwner = await db.user.findFirst({ where: { role: 'owner' } });
    if (existingOwner) {
      return NextResponse.json({ error: 'Owner already exists' }, { status: 400 });
    }

    const { nickname, password } = await request.json();
    
    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password required' }, { status: 400 });
    }

    const user = await db.user.create({
      data: {
        nickname,
        passwordHash: hashPassword(password),
        role: 'owner',
        avatar: null,
      },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'owner_created',
        details: 'Owner account created via seed',
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
