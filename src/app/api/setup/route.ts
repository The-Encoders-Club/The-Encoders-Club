import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";


/**
 * GET /api/setup?code=TU_CODIGO
 *
 * Crea el usuario admin inicial si no existe.
 * Protegido con la variable de entorno SETUP_CODE (configurala en Cloudflare).
 *
 * Después de usarlo una vez, puedes:
 *  - Cambiar SETUP_CODE
 *  - O eliminar este archivo
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const expected = process.env.SETUP_CODE;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "SETUP_CODE no está configurado en las variables de entorno." },
      { status: 500 }
    );
  }
  if (code !== expected) {
    return NextResponse.json({ ok: false, error: "Código inválido." }, { status: 401 });
  }

  const nickname = req.nextUrl.searchParams.get("user") || "admin";
  const password = req.nextUrl.searchParams.get("password") || "admin123";
  const email = req.nextUrl.searchParams.get("email") || "admin@encoders.club";

  const existing = await db.user.findUnique({ where: { nickname } });
  if (existing) {
    return NextResponse.json({
      ok: true,
      created: false,
      message: `El usuario "${nickname}" ya existe. No se hizo nada.`,
    });
  }

  const user = await db.user.create({
    data: {
      nickname,
      email,
      passwordHash: hashPassword(password),
      role: "owner",
      isPremium: true,
      locale: "es",
    },
    select: { id: true, nickname: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({
    ok: true,
    created: true,
    message: `Usuario "${nickname}" creado. Cambia la contraseña desde la app cuanto antes.`,
    user,
    credentials: { nickname, password },
  });
}
