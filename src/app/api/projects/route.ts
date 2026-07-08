// ============================================================
// GET /api/projects
// Public: list all published dynamic projects ordered by
// sortOrder ASC, then createdAt DESC.
//
// These are the admin-managed projects. Hardcoded projects
// (monika / natsuki / yuri) live in src/data/projects.ts and
// are merged on the client.
// ============================================================

import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { parseProjectRow, type DynamicProject } from '@/data/dynamic-projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDB();
    const { results } = await db
      .prepare(
        'SELECT * FROM Project WHERE isPublished = 1 ORDER BY sortOrder ASC, createdAt DESC'
      )
      .all();

    const projects: DynamicProject[] = (results || []).map((row) =>
      parseProjectRow(row as Record<string, unknown>)
    );

    return NextResponse.json({ projects });
  } catch (error) {
    // If the Project table doesn't exist yet, return an empty list
    // instead of a 500 — the public site should still work.
    console.error('List projects error:', error);
    return NextResponse.json({ projects: [] });
  }
}
