import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/drizzle/schema';

// Get D1 database instance from Cloudflare Workers environment
// This works with @opennextjs/cloudflare
export function getDb(D1Binding: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(D1Binding, { schema });
}

// Get D1 from the global env (set by opennextjs cloudflare adapter)
export function getD1(): D1Database {
  // @ts-expect-error - Cloudflare env is injected by opennextjs
  const env = process.env.__NEXT_ON_CLOUDFLARE__?.bindings || globalThis.__CLOUDFLARE_BINDINGS__;

  if (env?.DB) {
    return env.DB as D1Database;
  }

  // Fallback for local development with wrangler
  throw new Error('D1 database binding not found. Make sure wrangler.toml is configured and you are running with wrangler.');
}

export type Database = DrizzleD1Database<typeof schema>;
