import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Create the owner account (only if no owner exists)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { nickname, password, email } = body;

    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password are required.' }, { status: 400 });
    }

    const nicknameStr = String(nickname);
    const passwordStr = String(password);

    if (nicknameStr.length < 3 || nicknameStr.length > 20) {
      return NextResponse.json({ error: 'Nickname must be between 3 and 20 characters.' }, { status: 400 });
    }

    if (passwordStr.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const db = await getDB();

    // Check if an owner already exists
    const existingOwner = await db
      .prepare("SELECT id FROM User WHERE role = 'owner'")
      .first();

    if (existingOwner) {
      return NextResponse.json({ error: 'An owner account already exists.' }, { status: 409 });
    }

    // Check if nickname is already taken
    const existingNickname = await db
      .prepare('SELECT id FROM User WHERE nickname = ?')
      .bind(nicknameStr)
      .first();

    if (existingNickname) {
      return NextResponse.json({ error: 'This nickname is already taken.' }, { status: 409 });
    }

    // Check if email is already taken
    const emailStr = email ? String(email) : null;
    if (emailStr) {
      const existingEmail = await db
        .prepare('SELECT id FROM User WHERE email = ?')
        .bind(emailStr)
        .first();

      if (existingEmail) {
        return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
      }
    }

    const ownerId = generateId();
    const passwordHash = await hashPassword(passwordStr);
    const now = nowISO();

    await db
      .prepare(
        'INSERT INTO User (id, nickname, email, passwordHash, role, isPremium, isBanned, discordLinked, locale, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        ownerId,
        nicknameStr,
        emailStr,
        passwordHash,
        'owner',
        1, // isPremium
        0, // isBanned
        0, // discordLinked
        'es',
        now,
        now
      )
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ownerId,
        'owner_created',
        'Owner account created during setup',
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    return NextResponse.json({
      message: 'Owner account created successfully.',
      id: ownerId,
      nickname: nicknameStr,
    }, { status: 201 });
  } catch (error) {
    console.error('Seed owner error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
