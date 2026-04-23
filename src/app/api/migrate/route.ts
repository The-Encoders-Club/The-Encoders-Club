import { NextRequest, NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { MIGRATION_0001_INIT, MIGRATION_0002_SEED_ADMIN } from "@/lib/migrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/migrate?code=TU_CODIGO
 *
 * Aplica las migraciones de D1 (CREATE TABLE + seed admin).
 * Idempotente: usa CREATE TABLE IF NOT EXISTS y INSERT OR IGNORE.
 * Protegido con la variable de entorno SETUP_CODE.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const expected = process.env.SETUP_CODE;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "SETUP_CODE no está configurado." },
      { status: 500 }
    );
  }
  if (code !== expected) {
    return NextResponse.json({ ok: false, error: "Código inválido." }, { status: 401 });
  }

  const db = getD1();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "No hay binding D1. Configura DB en Settings → Bindings." },
      { status: 500 }
    );
  }

  const results: Array<{ step: string; ok: boolean; error?: string }> = [];

  for (const [name, sql] of [
    ["0001_init", MIGRATION_0001_INIT],
    ["0002_seed_admin", MIGRATION_0002_SEED_ADMIN],
  ] as const) {
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await db.prepare(stmt).run();
        results.push({ step: `${name}#${i}`, ok: true });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ step: `${name}#${i}`, ok: false, error: msg });
      }
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json({
    ok: failed.length === 0,
    applied: results.length,
    failed: failed.length,
    results,
  });
}
