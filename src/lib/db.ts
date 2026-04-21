// ============================================================
// Cloudflare D1 + Prisma adapter
// Each request creates its own PrismaClient bound to the D1 database.
// D1 binding is obtained from the Cloudflare request context.
// ============================================================

import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

/**
 * Create a Prisma client instance bound to a Cloudflare D1 database.
 * Call this inside request handlers where getRequestContext() is available.
 *
 * @example
 *   import { getRequestContext } from '@cloudflare/next-on-pages/worker';
 *   import { getDb } from '@/lib/db';
 *
 *   export async function GET() {
 *     const db = getDb(getRequestContext().env.DB);
 *     const users = await db.user.findMany();
 *   }
 */
export function getDb(d1: D1Database): PrismaClient {
  const adapter = new PrismaD1(d1);
  return new PrismaClient({ adapter });
}

/**
 * Re-export the Prisma type for use in other modules that need
 * to type-annotate their db variable.
 */
export type { PrismaClient };
