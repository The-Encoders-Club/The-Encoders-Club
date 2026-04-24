import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File;
    
    if (!avatarFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (avatarFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be less than 5MB' }, { status: 400 });
    }

    const bytes = await avatarFile.arrayBuffer();

    // In Cloudflare Workers, we cannot write to the filesystem.
    // Instead, we store the avatar as a base64 data URL directly in the database.
    // For a production app, consider using Cloudflare R2 for file storage.
    // NOTE: We use Uint8Array + btoa() instead of Buffer to stay compatible
    // with the Workers runtime (Buffer requires nodejs_compat and can be unreliable).
    const allowedTypes: Record<string, string> = {
      'image/jpeg': 'image/jpeg',
      'image/png': 'image/png',
      'image/webp': 'image/webp',
      'image/gif': 'image/gif',
    };
    const mimeType = allowedTypes[avatarFile.type] || 'image/jpeg';
    const uint8 = new Uint8Array(bytes);
    let binary = '';
    for (let i = 0; i < uint8.byteLength; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);
    const avatarUrl = `data:${mimeType};base64,${base64}`;

    const db = createDb();
    await db.user.update({
      where: { id: session.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
