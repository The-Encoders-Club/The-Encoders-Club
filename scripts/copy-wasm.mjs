/**
 * copy-wasm.mjs
 *
 * Busca el archivo query_engine_bg.wasm generado por Prisma y lo copia
 * al directorio .open-next/ para que Wrangler lo encuentre al desplegar.
 *
 * Uso:  node scripts/copy-wasm.mjs
 * Se ejecuta automáticamente como parte de `npm run cf:build`.
 */
import { cpSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

/**
 * Busca recursivamente un archivo por nombre dentro de un directorio.
 * @param {string} dir  Directorio raíz donde buscar
 * @param {string} name Nombre del archivo a encontrar
 * @returns {string|null} Ruta absoluta o null si no se encuentra
 */
function findFile(dir, name) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      // Saltar node_modules y .git para evitar búsquedas innecesarias
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const result = findFile(fullPath, name);
        if (result) return result;
      } else if (entry.name === name) {
        return fullPath;
      }
    }
  } catch {
    // Permiso denegado u otro error — ignorar
  }
  return null;
}

const wasmName = "query_engine_bg.wasm";
const searchDir = "src/generated/prisma";
const outDir = ".open-next";

console.log(`🔍 Buscando ${wasmName} en ${searchDir}...`);

const wasmFile = findFile(searchDir, wasmName);

if (wasmFile) {
  const dest = join(outDir, basename(wasmFile));
  cpSync(wasmFile, dest);
  console.log(`✅ Copiado: ${wasmFile} → ${dest}`);
} else {
  console.error(`❌ No se encontró ${wasmName} en ${searchDir}/`);
  console.error("   Asegúrate de haber ejecutado 'prisma generate' antes del build.");
  process.exit(1);
}
