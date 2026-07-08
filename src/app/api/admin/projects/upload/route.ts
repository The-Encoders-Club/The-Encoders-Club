// ============================================================
// POST /api/admin/projects/upload
// Upload a single image (cover or preview) to R2.
//
// Uses the existing AVATAR_BUCKET binding (the only R2 bucket
// configured in wrangler.toml) — project images are stored with
// the `projects/` key prefix so they don't collide with user
// avatars. They are served publicly by /api/project-images/[...key].
//
// Auth: admin / owner only.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/db';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB per image

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    if (!['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Formatos válidos: JPEG, PNG, GIF, WebP, SVG.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El archivo supera el límite de 8MB.' }, { status: 400 });
    }

    const env = await getEnv();
    const arrayBuffer = await file.arrayBuffer();
    const ext = EXT_MAP[file.type] || 'webp';
    const key = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    await env.AVATAR_BUCKET.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const url = `/api/project-images/${key}`;
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Project image upload error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

