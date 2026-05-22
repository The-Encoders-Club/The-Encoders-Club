import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifySecurityData, checkRateLimit } from '@/lib/auth';

// POST: Verify identity without changing password
// Used by the recovery modal to check code/question before asking for new password
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const allowed = await checkRateLimit(ip, 5, 300000); // 5 attempts per 5 minutes
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json() as {
      nickname: string;
      method: 'code' | 'question';
      code?: string;
      answer?: string;
    };

    const { nickname, method, code, answer } = body;

    if (!nickname || !method) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    if (method === 'code' && !code) {
      return NextResponse.json({ error: 'El codigo de recuperacion es requerido.' }, { status: 400 });
    }

    if (method === 'question' && !answer) {
      return NextResponse.json({ error: 'La respuesta de seguridad es requerida.' }, { status: 400 });
    }

    const db = await getDB();

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
        return NextResponse.json({ error: 'No tienes un codigo de recuperacion configurado.' }, { status: 400 });
      }
      verified = await verifySecurityData(code!, user.recoveryCodeHash as string);
    } else {
      if (!user.securityAnswerHash) {
        return NextResponse.json({ error: 'No tienes una pregunta de seguridad configurada.' }, { status: 400 });
      }
      verified = await verifySecurityData(answer!, user.securityAnswerHash as string);
    }

    if (!verified) {
      return NextResponse.json({
        error: method === 'code' ? 'Codigo de recuperacion incorrecto.' : 'Respuesta de seguridad incorrecta.',
      }, { status: 401 });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('[Recover] Verify error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

