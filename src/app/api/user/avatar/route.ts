import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
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

    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Limit to 500KB (Cloudflare Workers don't have filesystem)
    const MAX_SIZE = 500 * 1024; // 500KB
    if (avatarFile.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be less than 500KB' }, { status: 400 });
    }

    // Convert to base64 data URL
    const arrayBuffer = await avatarFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    const dataUrl = `data:${avatarFile.type};base64,${base64}`;

    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    await db.update(users).set({ avatar: dataUrl, updatedAt: now }).where(eq(users.id, session.id));

    return NextResponse.json({ success: true, avatar: dataUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
