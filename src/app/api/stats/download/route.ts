// ============================================================
// POST /api/stats/download
// Increments the total downloads counter by 1
// Called client-side when user clicks a download button
// ============================================================

import { getDB } from '@/lib/db';

export async function POST() {
  try {
    const db = await getDB();
    await db.prepare('UPDATE SiteStats SET value = value + 1 WHERE key = ?')
      .bind('total_downloads')
      .run();
    return Response.json({ success: true });
  } catch (error) {
    // Fail silently — don't block the user's download
    return Response.json({ success: true });
  }
}
