// ============================================================
// D1 Database Client - Replaces Prisma for Cloudflare Workers
// ============================================================

import { getCloudflareContext } from '@opennextjs/cloudflare';

// Get the D1 database binding from Cloudflare context
export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext();
  return env.DB;
}

// Get all environment bindings
export async function getEnv() {
  const { env } = await getCloudflareContext();
  return env as { DB: D1Database; AVATAR_BUCKET: R2Bucket; RATE_LIMITER: KVNamespace; NODE_ENV: string; SITE_URL: string };
}

// Generate a CUID-like ID (simplified for edge runtime)
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const counter = (Math.random() * 1679616 | 0).toString(36); // 4 random base36 chars
  return `${timestamp}${counter}${random}`;
}

// Current timestamp as ISO string
export function nowISO(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Convert SQLite row (0/1) to boolean
export function toBool(val: number | null | undefined): boolean {
  return val === 1 || val === true;
}

// Convert boolean to SQLite integer
export function fromBool(val: boolean): number {
  return val ? 1 : 0;
}
