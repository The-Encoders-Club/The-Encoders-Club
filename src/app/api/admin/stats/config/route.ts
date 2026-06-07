import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Read base offsets for visits and downloads (admin+ only)
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const db = await getDB();
    const { results } = await db.prepare("SELECT key, value FROM SiteStats WHERE key IN ('visits_base', 'downloads_base')").all();

    const config: Record<string, number> = { visits_base: 0, downloads_base: 0 };
    for (const row of (results || [])) {
      config[(row as { key: string; value: number }).key] = (row as { key: string; value: number }).value || 0;
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Get stats config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update base offsets for visits and downloads (admin+ only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const visitsBase = body.visits_base;
    const downloadsBase = body.downloads_base;

    const db = await getDB();
    const now = nowISO();

    // Validate inputs
    const vBase = typeof visitsBase === 'number' && visitsBase >= 0 ? Math.floor(visitsBase) : undefined;
    const dBase = typeof downloadsBase === 'number' && downloadsBase >= 0 ? Math.floor(downloadsBase) : undefined;

    if (vBase === undefined && dBase === undefined) {
      return NextResponse.json({ error: 'Provide visits_base and/or downloads_base as non-negative numbers.' }, { status: 400 });
    }

    if (vBase !== undefined) {
      await db.prepare('INSERT INTO SiteStats (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind('visits_base', vBase).run();
    }
    if (dBase !== undefined) {
      await db.prepare('INSERT INTO SiteStats (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind('downloads_base', dBase).run();
    }

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'stats_config_updated',
        `Stats base updated: visits_base=${vBase ?? 'unchanged'}, downloads_base=${dBase ?? 'unchanged'}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    return NextResponse.json({ message: 'Stats configuration updated.' });
  } catch (error) {
    console.error('Update stats config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


