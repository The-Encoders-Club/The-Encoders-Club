// ── THE KEY FIX: Import from the EDGE entry point ──────────────────────
// @prisma/client   → uses fs.readdir, fs.readFile, etc. → CRASHES on Workers
// @prisma/client/edge → NO filesystem calls → works on Workers/Deno/Bun
//
// With queryCompiler + driverAdapters + --no-engine, Prisma generates
// a pure TypeScript query compiler. The edge import ensures zero fs usage.
import { PrismaClient } from "@prisma/client/edge";
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
