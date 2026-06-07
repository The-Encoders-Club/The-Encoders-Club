// ============================================================
// GET /api/stats
// Returns site stats and tracks visits (deduped by IP per day)
// ============================================================

import { NextRequest } from 'next/server';
import { getDB, getEnv } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const env = await getEnv();

    // Get client IP (Cloudflare Workers provides this header)
    const ip = request.headers.get('CF-Connecting-IP') ||
               request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
               'unknown';

    // Deduplicate visits: same IP counted once per day via KV (24h TTL)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const visitKey = `visit:${ip}:${today}`;

    try {
      const alreadyVisited = await env.RATE_LIMITER.get(visitKey);
      if (!alreadyVisited) {
        // First visit today — increment counter
        await db.prepare('UPDATE SiteStats SET value = value + 1 WHERE key = ?')
          .bind('total_visits')
          .run();
        // Store in KV with 24h TTL to prevent re-counting
        await env.RATE_LIMITER.put(visitKey, '1', { expirationTtl: 86400 });
      }
    } catch {
      // If KV fails, we still allow the request (fail-open)
    }

    // Fetch all stats
    const { results } = await db.prepare('SELECT key, value FROM SiteStats').all();

    const stats: Record<string, number> = {};
    for (const row of results) {
      stats[row.key as string] = (row.value as number) || 0;
    }

    // Add configurable base offsets (set from admin panel)
    const visitsBase = stats['visits_base'] || 0;
    const downloadsBase = stats['downloads_base'] || 0;

    return Response.json({
      visits: (stats['total_visits'] || 0) + visitsBase,
      downloads: (stats['total_downloads'] || 0) + downloadsBase,
      // Also return breakdown for admin use
      _real: {
        visits: stats['total_visits'] || 0,
        downloads: stats['total_downloads'] || 0,
      },
    });
  } catch (error) {
    // If DB fails, return zeros — site still works
    return Response.json({ visits: 0, downloads: 0 });
  }
}
