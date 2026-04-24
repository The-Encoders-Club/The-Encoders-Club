import { PrismaClient } from "@prisma/client";

/**
 * Creates a fresh PrismaClient for each request.
 *
 * IMPORTANT — Cloudflare Workers restriction:
 * D1 bindings are scoped to a single request. A PrismaClient (and its
 * underlying D1 adapter) MUST NOT be shared across requests. Using a
 * global/singleton client causes the runtime error:
 *   "Cannot perform I/O on behalf of a different request."
 *
 * For local development (no Cloudflare context) we fall back to the
 * standard PrismaClient which reads DATABASE_URL from the environment.
 */
export function createDb(): PrismaClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const { env } = getCloudflareContext();
    if (env?.DB) {
      const adapter = new PrismaD1(env.DB);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not inside a Cloudflare Worker — fall through to standard client
    // (e.g. during build, local dev)
  }
  return new PrismaClient();
}

/**
 * @deprecated Use createDb() instead to get a per-request client.
 * This export is kept only for backward compatibility during migration.
 * All API routes should call createDb() at the top of each handler.
 */
// In Cloudflare Workers, we MUST NOT initialize the DB client globally.
// If you still have code importing { db }, it might fail or return a client 
// without the correct request-scoped D1 binding.
export const db = (null as unknown as PrismaClient);
