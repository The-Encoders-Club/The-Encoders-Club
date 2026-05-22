import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO } from '@/lib/db';
import { hashPassword, checkRateLimit, isValidNickname, isValidPassword, generateRecoveryCode, hashSecurityData } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 5, 300000); // 5 registrations per 5 minutes
    if (!allowed) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as { nickname: string; password: string; confirmPassword?: string; email?: string; locale?: string; securityQuestion?: string; securityAnswer?: string };
    const { nickname, password, confirmPassword, email, locale, securityQuestion, securityAnswer } = body;

    if (!nickname || !password) {
      return NextResponse.json({ error: 'Nickname and password are required.' }, { status: 400 });
    }

    if (!isValidNickname(nickname)) {
      return NextResponse.json(
        { error: 'Nickname must be 3-20 characters and contain only letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    if (email && typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // Validate confirmPassword
    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 });
    }

    // Validate security question and answer
    if (!securityQuestion || !securityAnswer) {
      return NextResponse.json({ error: 'La pregunta y respuesta de seguridad son requeridas.' }, { status: 400 });
    }
    if (securityAnswer.trim().length < 2) {
      return NextResponse.json({ error: 'La respuesta de seguridad es muy corta.' }, { status: 400 });
    }

    const db = await getDB();

    // Check if nickname already exists
    const existing = await db
      .prepare('SELECT id FROM User WHERE nickname = ?')
      .bind(nickname)
      .first();

    if (existing) {
      return NextResponse.json({ error: 'This nickname is already taken.' }, { status: 409 });
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await db
        .prepare('SELECT id FROM User WHERE email = ?')
        .bind(email)
        .first();

      if (existingEmail) {
        return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
      }
    }

    const userId = generateId();
    const passwordHash = await hashPassword(password);
    const now = nowISO();

    // Generate unique recovery code
    let recoveryCode = generateRecoveryCode();
    let recoveryCodeHash = await hashSecurityData(recoveryCode);

    // Ensure uniqueness (extremely unlikely collision, but check anyway)
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 5) {
      const existing = await db.prepare('SELECT id FROM User WHERE recoveryCodeHash = ?').bind(recoveryCodeHash).first();
      if (!existing) {
        codeExists = false;
      } else {
        recoveryCode = generateRecoveryCode();
        recoveryCodeHash = await hashSecurityData(recoveryCode);
        attempts++;
      }
    }

    // Hash security answer
    const securityAnswerHash = await hashSecurityData(securityAnswer);

    await db
      .prepare(
        'INSERT INTO User (id, nickname, email, passwordHash, role, isPremium, isBanned, discordLinked, locale, securityQuestion, securityAnswerHash, recoveryCodeHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        userId,
        nickname,
        email || null,
        passwordHash,
        'user',
        0,
        0,
        0,
        locale || 'es',
        securityQuestion,
        securityAnswerHash,
        recoveryCodeHash,
        now,
        now
      )
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        'register',
        `New user registered: ${nickname}`,
        ip,
        now
      )
      .run();

    // Create notification
    await db
      .prepare('INSERT INTO Notification (id, userId, type, title, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        'welcome',
        'Welcome to The Encoders Club!',
        'Your account has been created successfully. Welcome to the community!',
        now
      )
      .run();

    // Create session
    await createSession(userId, false);

    return NextResponse.json({
      success: true,
      recoveryCode,
      user: {
        id: userId,
        nickname,
        email: email || null,
        avatar: null,
        role: 'user',
        isPremium: false,
        locale: locale || 'es',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
