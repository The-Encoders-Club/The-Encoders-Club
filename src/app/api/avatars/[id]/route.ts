import { NextRequest, NextResponse } from 'next/server';

// GET: Serve avatar from R2 bucket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: key } = await params;

    if (!key) {
      return NextResponse.json({ error: 'Avatar key is required.' }, { status: 400 });
    }

    const env = await (await import('@/lib/db')).getEnv();

    const object = await env.AVATAR_BUCKET.get(key);

    if (!object) {
      return NextResponse.json({ error: 'Avatar not found.' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/webp');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', key);

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error('Avatar serve error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
