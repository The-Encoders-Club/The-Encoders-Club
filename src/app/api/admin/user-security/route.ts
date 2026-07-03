import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';
import {
  hashPassword,
  hashSecurityData,
  generateRecoveryCode,
  isValidPassword,
} from '@/lib/auth';

// ─── Helpers ───

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

async function logActivity(
  db: D1Database,
  session: { id: string },
  action: string,
  details: string,
  ip: string,
  now: string
) {
  await db
    .prepare(
      'INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      session.id,
      action,
      details,
      ip,
      now
    )
    .run();
}

async function notifyUser(
  db: D1Database,
  userId: string,
  title: string,
  message: string,
  now: string
) {
  await db
    .prepare(
      'INSERT INTO Notification (id, userId, type, title, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      'admin_action',
      title,
      message,
      now
    )
    .run();
}

/**
 * Permission matrix:
 *
 * view_security_question  → mod, admin, owner
 * view_hashes             → admin, owner             (NOT mod)
 * reset_password          → owner (any target); admin (target ≠ owner/admin)
 * reset_security_qa       → owner (any target); admin (target ≠ owner/admin)
 * regen_recovery_code     → owner (any target); admin (target ≠ owner/admin); mod (target ≠ owner/admin)
 */

function canViewHashes(role: string): boolean {
  return role === 'admin' || role === 'owner';
}

function canModifyAccount(
  actorRole: string,
  targetRole: string
): { allowed: boolean; reason?: string } {
  // Owner can modify anyone
  if (actorRole === 'owner') return { allowed: true };
  // Admin can modify non-owner/non-admin targets
  if (actorRole === 'admin') {
    if (targetRole === 'owner')
      return { allowed: false, reason: 'Solo el owner puede modificar cuentas de owner.' };
    if (targetRole === 'admin')
      return { allowed: false, reason: 'Los admins no pueden modificar otras cuentas de admin.' };
    return { allowed: true };
  }
  // Moderator can modify non-owner/non-admin targets (only for regen recovery)
  if (actorRole === 'moderator') {
    if (targetRole === 'owner' || targetRole === 'admin')
      return { allowed: false, reason: 'Los moderators no pueden modificar cuentas de admin/owner.' };
    return { allowed: true };
  }
  return { allowed: false, reason: 'Permisos insuficientes.' };
}

// ─── GET: View security info ───
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!['moderator', 'admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const db = await getDB();

    const target = (await db
      .prepare(
        'SELECT id, nickname, role, securityQuestion, passwordHash, securityAnswerHash, recoveryCodeHash FROM User WHERE id = ?'
      )
      .bind(userId)
      .first()) as
      | {
          id: string;
          nickname: string;
          role: string;
          securityQuestion: string | null;
          passwordHash: string | null;
          securityAnswerHash: string | null;
          recoveryCodeHash: string | null;
        }
      | null;

    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Defense in depth: moderators cannot view owner/admin security info
    if (session.role === 'moderator' && (target.role === 'owner' || target.role === 'admin')) {
      return NextResponse.json(
        { error: 'Los moderators no pueden ver informacion de seguridad de admins/owners.' },
        { status: 403 }
      );
    }

    const response: Record<string, unknown> = {
      userId: target.id,
      nickname: target.nickname,
      role: target.role,
      securityQuestion: target.securityQuestion || null,
      hasPassword: Boolean(target.passwordHash),
      hasSecurityAnswer: Boolean(target.securityAnswerHash),
      hasRecoveryCode: Boolean(target.recoveryCodeHash),
    };

    // Hashes are admin/owner-only
    if (canViewHashes(session.role)) {
      response.passwordHash = target.passwordHash;
      response.securityAnswerHash = target.securityAnswerHash;
      response.recoveryCodeHash = target.recoveryCodeHash;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get user security error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ─── POST: Perform security action ───
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!['moderator', 'admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const body = (await request.json()) as {
      userId?: string;
      action?: 'reset_password' | 'reset_security' | 'regen_recovery';
      newPassword?: string;
      securityQuestion?: string;
      securityAnswer?: string;
    };

    const { userId, action, newPassword, securityQuestion, securityAnswer } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required.' }, { status: 400 });
    }

    const db = await getDB();
    const ip = getClientIp(request);
    const now = nowISO();

    // Fetch target
    const target = (await db
      .prepare('SELECT id, nickname, role FROM User WHERE id = ?')
      .bind(userId)
      .first()) as { id: string; nickname: string; role: string } | null;

    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // ─── regen_recovery: moderator, admin, owner (with target restrictions) ───
    if (action === 'regen_recovery') {
      const perm = canModifyAccount(session.role, target.role);
      if (!perm.allowed) {
        return NextResponse.json({ error: perm.reason }, { status: 403 });
      }

      let recoveryCode = generateRecoveryCode();
      let recoveryCodeHash = await hashSecurityData(recoveryCode);

      // Ensure uniqueness
      let codeExists = true;
      let attempts = 0;
      while (codeExists && attempts < 5) {
        const existing = await db
          .prepare('SELECT id FROM User WHERE recoveryCodeHash = ?')
          .bind(recoveryCodeHash)
          .first();
        if (!existing) {
          codeExists = false;
        } else {
          recoveryCode = generateRecoveryCode();
          recoveryCodeHash = await hashSecurityData(recoveryCode);
          attempts++;
        }
      }

      await db
        .prepare('UPDATE User SET recoveryCodeHash = ?, updatedAt = ? WHERE id = ?')
        .bind(recoveryCodeHash, now, target.id)
        .run();

      await logActivity(
        db,
        session,
        'admin_user_recovery_regen',
        `Recovery code regenerated for user ${target.nickname} (${target.id})`,
        ip,
        now
      );

      await notifyUser(
        db,
        target.id,
        'Código de recuperación regenerado',
        'Un administrador regeneró tu código de recuperación. Contáctalo para obtener el nuevo código.',
        now
      );

      return NextResponse.json({
        success: true,
        action: 'regen_recovery',
        recoveryCode,
        message: 'Código de recuperación regenerado. Muéstralo al usuario una sola vez.',
      });
    }

    // ─── reset_password: admin, owner (with target restrictions) ───
    if (action === 'reset_password') {
      if (session.role === 'moderator') {
        return NextResponse.json(
          { error: 'Los moderators no pueden resetear contraseñas.' },
          { status: 403 }
        );
      }
      const perm = canModifyAccount(session.role, target.role);
      if (!perm.allowed) {
        return NextResponse.json({ error: perm.reason }, { status: 403 });
      }

      // Either use provided password or generate a random one
      let finalPassword: string;
      if (newPassword && newPassword.trim().length > 0) {
        if (!isValidPassword(newPassword)) {
          return NextResponse.json(
            { error: 'La contraseña debe tener al menos 6 caracteres.' },
            { status: 400 }
          );
        }
        finalPassword = newPassword;
      } else {
        // Generate a random 12-char alphanumeric password
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        finalPassword = Array.from({ length: 12 }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('');
      }

      const passwordHash = await hashPassword(finalPassword);

      await db
        .prepare('UPDATE User SET passwordHash = ?, updatedAt = ? WHERE id = ?')
        .bind(passwordHash, now, target.id)
        .run();

      await logActivity(
        db,
        session,
        'admin_user_password_reset',
        `Password reset for user ${target.nickname} (${target.id})`,
        ip,
        now
      );

      await notifyUser(
        db,
        target.id,
        'Contraseña reseteada',
        'Un administrador reseteó tu contraseña. Contáctalo para obtener la nueva contraseña e iníciala sesión para cambiarla.',
        now
      );

      return NextResponse.json({
        success: true,
        action: 'reset_password',
        newPassword: finalPassword,
        message: 'Contraseña reseteada. Muéstrala al usuario una sola vez.',
      });
    }

    // ─── reset_security: admin, owner (with target restrictions) ───
    if (action === 'reset_security') {
      if (session.role === 'moderator') {
        return NextResponse.json(
          { error: 'Los moderators no pueden resetear la pregunta de seguridad.' },
          { status: 403 }
        );
      }
      const perm = canModifyAccount(session.role, target.role);
      if (!perm.allowed) {
        return NextResponse.json({ error: perm.reason }, { status: 403 });
      }

      if (!securityQuestion || !securityAnswer) {
        return NextResponse.json(
          { error: 'La pregunta y respuesta de seguridad son requeridas.' },
          { status: 400 }
        );
      }
      if (securityAnswer.trim().length < 2) {
        return NextResponse.json(
          { error: 'La respuesta de seguridad es muy corta.' },
          { status: 400 }
        );
      }

      const securityAnswerHash = await hashSecurityData(securityAnswer);

      await db
        .prepare(
          'UPDATE User SET securityQuestion = ?, securityAnswerHash = ?, updatedAt = ? WHERE id = ?'
        )
        .bind(securityQuestion, securityAnswerHash, now, target.id)
        .run();

      await logActivity(
        db,
        session,
        'admin_user_security_reset',
        `Security question + answer reset for user ${target.nickname} (${target.id})`,
        ip,
        now
      );

      await notifyUser(
        db,
        target.id,
        'Pregunta de seguridad actualizada',
        'Un administrador actualizó tu pregunta y respuesta de seguridad. Si no reconoces esta acción, contacta soporte.',
        now
      );

      return NextResponse.json({
        success: true,
        action: 'reset_security',
        message: 'Pregunta y respuesta de seguridad actualizadas.',
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('User security action error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

