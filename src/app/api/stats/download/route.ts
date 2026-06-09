// ============================================================
// POST /api/stats/download
// Increments the website download counter in the DB.
//
// This tracks downloads initiated from the website (clicks on
// project download buttons). These are counted separately from
// GitHub release downloads and are included in the total shown
// on the homepage.
//
// The download counter formula is:
//   Total = downloads_base + website_downloads + github_downloads + external_downloads_base
//
// PUBLIC endpoint — no auth required
// ============================================================

import { getDB } from '@/lib/db';

export async function POST() {
  try {
    const db = await getDB();
    await db.prepare('UPDATE SiteStats SET value = value + 1 WHERE key = ?')
      .bind('total_downloads')
      .run();
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: true }); // Fail silently
  }
}
