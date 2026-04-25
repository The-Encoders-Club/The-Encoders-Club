import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  server: {
    override: {
      esbuild: {
        plugins: [
          {
            /**
             * Plugin de esbuild: marca las importaciones .wasm como externas.
             *
             * El cliente Prisma generado con `runtime = "workerd"` importa
             * `query_engine_bg.wasm?module`.  Por defecto, esbuild incrusta
             * los bytes del WASM directamente en el JS bundle; en ese caso,
             * `new WebAssembly.Instance(bytes)` falla porque espera un
             * `WebAssembly.Module`, no un ArrayBuffer.
             *
             * Al marcar la importación como `external`, esbuild conserva
             * el `import` en el output.  Luego Wrangler resuelve ese import
             * de forma nativa y, en tiempo de ejecución, el valor importado
             * SÍ es un `WebAssembly.Module`.
             *
             * El script `scripts/copy-wasm.mjs` (ejecutado tras el build)
             * copia el archivo .wasm al lado de worker.js para que Wrangler
             * lo encuentre al desplegar.
             */
            name: "prisma-wasm-external",
            setup(build) {
              build.onResolve({ filter: /\.wasm(\?module)?$/ }, (args) => ({
                path: "./query_engine_bg.wasm",
                external: true,
              }));
            },
          },
        ],
      },
    },
  },
});
