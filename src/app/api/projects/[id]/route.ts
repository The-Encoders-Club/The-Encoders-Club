// ============================================================
// GET /api/projects/[id]
// Public: fetch a single published dynamic project by slug.
//
// Returns 404 if the project does not exist or is unpublished.
// Reserved slugs (monika / natsuki / yuri) are NOT served here
// — those are rendered by the bespoke themed layouts in
// /proyectos/[id]/page.tsx and never reach this endpoint.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { parseProjectRow, isReservedSlug, type DynamicProject } from '@/data/dynamic-projects';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing project id.' }, { status: 400 });
    }

    // Reserved slugs are never served as dynamic projects.
    if (isReservedSlug(id)) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const db = await getDB();
    const row = await db
      .prepare('SELECT * FROM Project WHERE id = ? AND isPublished = 1')
      .bind(id)
      .first();

    if (!row) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const project: DynamicProject = parseProjectRow(row as Record<string, unknown>);
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
