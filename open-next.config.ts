import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No custom esbuild plugins needed.
  //
  // With queryCompiler + --no-engine, there is NO WASM query engine.
  // With @prisma/client/edge import in db.ts, there are NO fs calls.
  // With serverExternalPackages in next.config.ts, webpack doesn't bundle Prisma.
  //
  // OpenNext handles the rest via its internal wrangler-external plugin
  // and automatic Prisma client patching for the workerd runtime.
});
