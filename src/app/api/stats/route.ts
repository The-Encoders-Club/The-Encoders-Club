// ============================================================
// GET /api/stats
// Returns site stats and tracks visits (deduped by IP per day)
//
// Downloads formula:
//   total = downloads_base (fixed) + github_downloads (real-time) + external_downloads_base (future platform)
//
// GitHub data is cached in KV for 15 minutes to avoid API rate limits.
// PUBLIC endpoint — no auth required
// ============================================================

import { NextRequest } from 'next/server';
import { getDB, getEnv } from '@/lib/db';

// GitHub repositories to track (easy to add more)
const GITHUB_REPOS = [
  { owner: 'The-Encoders-Club', repo: 'Monika-After-Story-ES' },
  { owner: 'The-Encoders-Club', repo: 'Just-Natsuki-ES' },
  { owner: 'The-Encoders-Club', repo: 'Just-Yuri-ES' },
];

// Cache GitHub stats for 15 minutes (in seconds)
const GITHUB_CACHE_TTL = 900;
const GITHUB_CACHE_KEY = 'github_downloads_cache';

interface GitHubCacheData {
  totalDownloads: number;
  perRepo: Record<string, number>;
  fetchedAt: string;
}

/**
 * Fetch total download count from a single GitHub repo's releases.
 * Returns the sum of download_count across all assets in all releases.
 */
async function fetchRepoDownloads(owner: string, repo: string): Promise<number> {
  let total = 0;
  let page = 1;
  const perPage = 100;

  // Paginate through all releases (most repos have < 100 releases)
  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'The-Encoders-Club-Stats',
        },
      }
    );

    if (!res.ok) {
      // If rate limited or error, return 0 for this repo (cached value will be used)
      console.warn(`GitHub API error for ${owner}/${repo}: ${res.status}`);
      return 0;
    }

    const releases = await res.json() as Array<{
      assets: Array<{ download_count: number }>;
    }>;

    if (!Array.isArray(releases) || releases.length === 0) break;

    for (const release of releases) {
      if (release.assets && Array.isArray(release.assets)) {
        for (const asset of release.assets) {
          total += asset.download_count || 0;
        }
      }
    }

    // If less than perPage results, we've reached the end
    if (releases.length < perPage) break;
    page++;
  }

  return total;
}

/**
 * Get GitHub downloads total, using KV cache to avoid rate limits.
 * Falls back to last cached value if the API call fails.
 */
async function getGitHubDownloads(kv: KVNamespace): Promise<GitHubCacheData> {
  // 1. Try to read from cache
  try {
    const cached = await kv.get(GITHUB_CACHE_KEY, 'json') as GitHubCacheData | null;
    if (cached && cached.totalDownloads !== undefined) {
      const age = Date.now() - new Date(cached.fetchedAt).getTime();
      if (age < GITHUB_CACHE_TTL * 1000) {
        // Cache is still fresh
        return cached;
      }
    }
  } catch {
    // KV read failed, continue to fetch
  }

  // 2. Fetch fresh data from GitHub
  const perRepo: Record<string, number> = {};
  let totalDownloads = 0;

  for (const { owner, repo } of GITHUB_REPOS) {
    try {
      const count = await fetchRepoDownloads(owner, repo);
      perRepo[`${owner}/${repo}`] = count;
      totalDownloads += count;
    } catch {
      perRepo[`${owner}/${repo}`] = 0;
    }
  }

  const freshData: GitHubCacheData = {
    totalDownloads,
    perRepo,
    fetchedAt: new Date().toISOString(),
  };

  // 3. Save to cache (best effort)
  try {
    await kv.put(GITHUB_CACHE_KEY, JSON.stringify(freshData), {
      expirationTtl: GITHUB_CACHE_TTL * 2, // Allow stale cache for up to 30 min
    });
  } catch {
    // KV write failed, that's fine
  }

  return freshData;
}

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

    // Fetch all stats from DB
    const { results } = await db.prepare('SELECT key, value FROM SiteStats').all();

    const stats: Record<string, number> = {};
    for (const row of results) {
      stats[row.key as string] = (row.value as number) || 0;
    }

    // ============================================================
    // DOWNLOADS = Fixed Base + GitHub (real-time) + External (future)
    // ============================================================
    const downloadsBase = stats['downloads_base'] || 0;        // Fixed number (admin panel)
    const externalBase = stats['external_downloads_base'] || 0; // Other platform (future)

    // Fetch GitHub downloads (cached in KV for 15 min)
    let githubDownloads = 0;
    let githubPerRepo: Record<string, number> = {};
    try {
      const ghData = await getGitHubDownloads(env.RATE_LIMITER);
      githubDownloads = ghData.totalDownloads;
      githubPerRepo = ghData.perRepo;
    } catch {
      // If GitHub fetch fails entirely, use 0
    }

    const totalDownloads = downloadsBase + githubDownloads + externalBase;

    // Visits: base offset + tracked visits
    const visitsBase = stats['visits_base'] || 0;

    return Response.json({
      visits: (stats['total_visits'] || 0) + visitsBase,
      downloads: totalDownloads,
      // Detailed breakdown (useful for admin panel)
      _breakdown: {
        downloads_base: downloadsBase,
        github_downloads: githubDownloads,
        external_downloads_base: externalBase,
        github_per_repo: githubPerRepo,
      },
    });
  } catch (error) {
    // If DB fails, return zeros — site still works
    return Response.json({ visits: 0, downloads: 0 });
  }
}
