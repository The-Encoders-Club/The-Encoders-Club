import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Read base offsets for visits and downloads (admin+ only)
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const db = await getDB();
    const { results } = await db.prepare(
      "SELECT key, value FROM SiteStats WHERE key IN ('visits_base', 'downloads_base', 'external_downloads_base')"
    ).all();

    const config: Record<string, number> = {
      visits_base: 0,
      downloads_base: 0,
      external_downloads_base: 0,
    };
    for (const row of (results || [])) {
      config[(row as { key: string; value: number }).key] = (row as { key: string; value: number }).value || 0;
    }

    // Also fetch live GitHub stats for the admin panel
    let githubDownloads = 0;
    let githubPerRepo: Record<string, number> = {};
    try {
      const env = await getEnv();
      const cached = await env.RATE_LIMITER.get('github_downloads_cache', 'json') as {
        totalDownloads: number;
        perRepo: Record<string, number>;
        fetchedAt: string;
      } | null;

      if (cached) {
        githubDownloads = cached.totalDownloads;
        githubPerRepo = cached.perRepo;
      }

      // Calculate total for display
      const totalDownloads = config.downloads_base + githubDownloads + config.external_downloads_base;

      return NextResponse.json({
        ...config,
        github_downloads: githubDownloads,
        github_per_repo: githubPerRepo,
        total_downloads_display: totalDownloads,
      });
    } catch {
      return NextResponse.json(config);
    }
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
    const externalBase = body.external_downloads_base;

    const db = await getDB();
    const now = nowISO();

    // Validate inputs
    const vBase = typeof visitsBase === 'number' && visitsBase >= 0 ? Math.floor(visitsBase) : undefined;
    const dBase = typeof downloadsBase === 'number' && downloadsBase >= 0 ? Math.floor(downloadsBase) : undefined;
    const eBase = typeof externalBase === 'number' && externalBase >= 0 ? Math.floor(externalBase) : undefined;

    if (vBase === undefined && dBase === undefined && eBase === undefined) {
      return NextResponse.json(
        { error: 'Provide visits_base, downloads_base, and/or external_downloads_base as non-negative numbers.' },
        { status: 400 }
      );
    }

    // Helper to upsert a SiteStats key
    async function upsertStat(key: string, value: number) {
      await db
        .prepare('INSERT INTO SiteStats (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
        .bind(key, value)
        .run();
    }

    if (vBase !== undefined) await upsertStat('visits_base', vBase);
    if (dBase !== undefined) await upsertStat('downloads_base', dBase);
    if (eBase !== undefined) await upsertStat('external_downloads_base', eBase);

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'stats_config_updated',
        `Stats base updated: visits_base=${vBase ?? 'unchanged'}, downloads_base=${dBase ?? 'unchanged'}, external_downloads_base=${eBase ?? 'unchanged'}`,
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
