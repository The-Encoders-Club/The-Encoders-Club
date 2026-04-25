// ── CRITICAL: Import from @prisma/client (NOT /edge) ──────────────────
// When using driverAdapters (PrismaD1), Prisma REQUIRES the standard
// import. The /edge endpoint is INCOMPATIBLE with the `adapter` option.
//
// With queryCompiler + driverAdapters + --no-engine, the generated client
// is pure TypeScript — no WASM, no fs, no dynamic require. So the standard
// import works perfectly on Cloudflare Workers.
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

/**
 * Returns a PrismaClient scoped to the current request.
 *
 * Uses React `cache()` so the same request reuses the same client instance.
 * Each NEW request gets a fresh PrismaClient — this is required on Workers
 * because reusing a client across requests causes
 * "Cannot perform I/O on behalf of a different request" errors.
 */
export const getDb = cache(function getDb(): PrismaClient {
  const { env } = getCloudflareContext();

  if (!env.DB) {
    throw new Error(
      "Binding D1 'DB' no disponible. Verifica wrangler.toml y que la migración esté aplicada."
    );
  }

  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
});

/**
 * For static routes (ISR/SSG) that need async context access.
 */
export const getDbAsync = cache(async function getDbAsync(): Promise<PrismaClient> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    throw new Error(
      "Binding D1 'DB' no disponible. Verifica wrangler.toml y que la migración esté aplicada."
    );
  }

  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
});

// ── Backward-compatible exports ──────────────────────────────────────
// The 16+ API routes that import `createDb` or `db` continue to work
// without ANY changes. Under the hood they now use the per-request
// getDb() from React cache().

/**
 * Returns a PrismaClient for the current request.
 * Alias for getDb() — kept for backward compatibility.
 */
export function createDb(): PrismaClient {
  return getDb();
}

/**
 * Proxy that lazily delegates to getDb().
 * This lets existing code do `db.user.create(...)` without changes.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const client = getDb() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function"
      ? (value as Function).bind(client)
      : value;
  },
});
