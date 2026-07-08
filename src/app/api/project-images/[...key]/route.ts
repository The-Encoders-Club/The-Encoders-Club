// ============================================================
// GET /api/project-images/[...key]
// Public: serve a project image stored in R2 (under the
// `projects/` key prefix). Used for covers and gallery previews
// uploaded via /api/admin/projects/upload.
//
// The full key path (e.g. `projects/123-abc.png`) is read from
// the catch-all param and looked up directly in AVATAR_BUCKET.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: segments } = await params;
    if (!segments || segments.length === 0) {
      return NextResponse.json({ error: 'Missing key.' }, { status: 400 });
    }

    const key = segments.join('/');

    // Safety: only allow keys that start with `projects/`
    if (!key.startsWith('projects/')) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const env = await getEnv();
    const object = await env.AVATAR_BUCKET.get(key);
    if (!object) {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/webp');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', key);

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Project image serve error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
