import { PrismaClient } from "@prisma/client";

let _client: PrismaClient | null = null;

function getClient(): PrismaClient {
  if (_client) return _client;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      _client = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });
      return _client;
    }
  } catch {
    // No estamos en Workers (dev local) → SQLite
  }
  _client = new PrismaClient();
  return _client;
}

// Proxy: difiere la creación hasta que se use db.user, db.comment, etc.
// (necesario porque getCloudflareContext() solo funciona dentro de un request)
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getClient() as any)[prop];
  },
});