import { NextResponse } from 'next/server';
import { getDB, toBool } from '@/lib/db';

// GET: Check if an owner account exists
export async function GET() {
  try {
    const db = await getDB();

    const owner = await db
      .prepare("SELECT id, nickname, avatar, createdAt FROM User WHERE role = 'owner'")
      .first();

    if (!owner) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      owner: {
        id: owner.id,
        nickname: owner.nickname,
        avatar: owner.avatar,
        createdAt: owner.createdAt,
      },
    });
  } catch (error) {
    console.error('Check owner error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
