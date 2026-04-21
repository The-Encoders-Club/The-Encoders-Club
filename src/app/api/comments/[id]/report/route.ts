import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { comments } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    await db.run(sql`UPDATE comments SET report_count = report_count + 1, is_reported = 1, updated_at = ${now} WHERE id = ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
