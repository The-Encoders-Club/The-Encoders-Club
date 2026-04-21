export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';

// Check if an owner already exists
export async function GET() {
  try {
    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const owner = await db.user.findFirst({ where: { role: 'owner' }, select: { id: true, nickname: true } });
    return NextResponse.json({ ownerExists: !!owner, ownerNickname: owner?.nickname || null });
  } catch {
    return NextResponse.json({ ownerExists: false, ownerNickname: null });
  }
}
