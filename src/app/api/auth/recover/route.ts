import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { verifySecurityData, hashPassword, isValidPassword, checkRateLimit, SECURITY_QUESTIONS } from '@/lib/auth';

// POST: Start recovery — look up user by nickname, return security question (masked)
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 15, 300000); // 15 attempts per 5 minutes
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as { nickname: string };
    const { nickname } = body;

    if (!nickname) {
      return NextResponse.json({ error: 'El nickname es requerido.' }, { status: 400 });
    }

    const db = await getDB();

    const user = await db
      .prepare('SELECT id, nickname, securityQuestion FROM User WHERE nickname = ?')
      .bind(nickname)
      .first();

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({ error: 'No se encontro un usuario con ese nickname.' }, { status: 404 });
    }

    // Check that the user has security data configured
    if (!user.securityQuestion) {
      return NextResponse.json({
        error: 'Este usuario no tiene configurada la pregunta de seguridad. Contacta a un administrador.',
      }, { status: 400 });
    }

    // The securityQuestion field can be either:
    //  - a predefined enum value (e.g. 'pet_name') for users who registered normally
    //  - arbitrary text (e.g. '¿Nombre de tu mascota?') for users whose Q&A was reset by an admin
    const storedQuestion = user.securityQuestion as string;
    const matched = SECURITY_QUESTIONS.find(q => q.value === storedQuestion);
    const questionLabel = matched
      ? matched.label_es
      : storedQuestion; // custom text from admin reset — return as-is

    return NextResponse.json({
      nickname: user.nickname,
      securityQuestion: {
        value: matched ? matched.value : storedQuestion,
        label: questionLabel,
      },
    });
  } catch (error) {
    console.error('[Recover] Start error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT: Verify identity (code OR security answer) and reset password
export async function PUT(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 15, 300000); // 15 attempts per 5 minutes
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as {
      nickname: string;
      method: 'code' | 'question';
      code?: string;
      answer?: string;
      newPassword: string;
    };

    const { nickname, method, code, answer, newPassword } = body;

    if (!nickname || !method || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    if (method !== 'code' && method !== 'question') {
      return NextResponse.json({ error: 'Metodo de verificacion invalido.' }, { status: 400 });
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    if (method === 'code' && !code) {
      return NextResponse.json({ error: 'El codigo de recuperacion es requerido.' }, { status: 400 });
    }

    if (method === 'question' && !answer) {
      return NextResponse.json({ error: 'La respuesta de seguridad es requerida.' }, { status: 400 });
    }

    const db = await getDB();

    // Fetch user with security data
    const user = await db
      .prepare('SELECT id, nickname, recoveryCodeHash, securityAnswerHash FROM User WHERE nickname = ?')
      .bind(nickname)
      .first();

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    let verified = false;

    if (method === 'code') {
      if (!user.recoveryCodeHash) {
        return NextResponse.json({ error: 'No tienes un codigo de recuperacion configurado. Usa la pregunta de seguridad.' }, { status: 400 });
      }
      verified = await verifySecurityData(code!, user.recoveryCodeHash as string);
    } else {
      if (!user.securityAnswerHash) {
        return NextResponse.json({ error: 'No tienes una pregunta de seguridad configurada.' }, { status: 400 });
      }
      verified = await verifySecurityData(answer!, user.securityAnswerHash as string);
    }

    if (!verified) {
      return NextResponse.json({ error: method === 'code' ? 'Codigo de recuperacion incorrecto.' : 'Respuesta de seguridad incorrecta.' }, { status: 401 });
    }

    // Update password
    const newHash = await hashPassword(newPassword);
    const now = nowISO();

    await db
      .prepare('UPDATE User SET passwordHash = ?, updatedAt = ? WHERE id = ?')
      .bind(newHash, now, user.id as string)
      .run();

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        user.id as string,
        'password_recovery',
        `Password recovered via ${method === 'code' ? 'recovery code' : 'security question'}`,
        ip,
        now
      )
      .run();

    return NextResponse.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('[Recover] Reset error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
