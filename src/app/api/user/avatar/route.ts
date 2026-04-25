import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Upload avatar to R2
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB.' }, { status: 400 });
    }

    const env = await (await import('@/lib/db')).getEnv();
    const arrayBuffer = await file.arrayBuffer();

    // Determine extension from file type
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    };
    const ext = extMap[file.type] || 'webp';

    // Generate key: {userId}-{timestamp}.{ext}
    const key = `${session.id}-${Date.now()}.${ext}`;

    // Store in R2
    await env.AVATAR_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Delete old avatar from R2 if user had one
    const db = await getDB();
    const user = await db
      .prepare('SELECT avatar FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    if (user?.avatar) {
      const avatarStr = String(user.avatar);
      // Extract key from old avatar URL like /api/avatars/{key}
      const oldKey = avatarStr.replace('/api/avatars/', '');
      if (oldKey) {
        try {
          await env.AVATAR_BUCKET.delete(oldKey);
        } catch {
          // Ignore if old avatar doesn't exist
        }
      }
    }

    // Update user's avatar field
    const avatarUrl = `/api/avatars/${key}`;
    await db
      .prepare('UPDATE User SET avatar = ?, updatedAt = ? WHERE id = ?')
      .bind(avatarUrl, nowISO(), session.id)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'avatar_updated',
        `Updated avatar: ${key}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        nowISO()
      )
      .run();

    return NextResponse.json({ avatar: avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
