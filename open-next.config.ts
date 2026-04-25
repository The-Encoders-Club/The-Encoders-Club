import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No special Prisma/WASM configuration needed!
  //
  // With the queryCompiler preview feature + --no-engine, the Prisma
  // client no longer uses a Rust/WASM query engine. All query logic
  // is pure TypeScript, so there's no WASM file to externalize.
  //
  // OpenNext automatically handles the Prisma client via its internal
  // wrangler-external esbuild plugin, which marks .wasm and .bin
  // files as external for Wrangler.
  //
  // The serverExternalPackages in next.config.ts ensures that
  // @prisma/client, .prisma/client, and @prisma/adapter-d1 are
  // not bundled by webpack, which prevents "Dynamic require" errors.
});
