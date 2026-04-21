// Cloudflare Workers / Pages environment type definitions.
// This file augments the global CloudflareEnv interface used by
// getRequestContext() from @cloudflare/next-on-pages/worker.

interface CloudflareEnv {
  DB: D1Database;
  // Add more bindings here as needed (KV, R2, Queues, etc.)
}
