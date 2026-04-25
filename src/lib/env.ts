// ============================================================
// Cloudflare Environment Bindings Type Definition
// ============================================================

export interface Env {
  DB: D1Database;
  AVATAR_BUCKET: R2Bucket;
  RATE_LIMITER: KVNamespace;
  NODE_ENV: string;
  SITE_URL: string;
}

// Extend Request to include Cloudflare bindings (for internal use)
declare module 'next' {
  interface NextRequest {
    readonly cf?: CfProperties<unknown>;
  }
}
