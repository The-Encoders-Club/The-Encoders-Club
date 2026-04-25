/**
 * copy-wasm.mjs
 *
 * Busca el archivo query_engine_bg.wasm generado por Prisma y lo copia
 * al directorio .open-next/ para que Wrangler lo encuentre al desplegar.
 *
 * Uso:  node scripts/copy-wasm.mjs
 * Se ejecuta automáticamente como parte de `npm run cf:build`.
 */
import { cpSync, existsSync, readdirSync } from "fs";
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
      // Saltar .git para evitar búsquedas innecesarias
      if (entry.name === ".git") continue;
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
const searchDirs = ["src/generated/prisma", "node_modules/.prisma/client"];
const outDir = ".open-next";

console.log("━".repeat(50));
console.log("📋 copy-wasm.mjs — Copiando WASM de Prisma");
console.log("━".repeat(50));

// Verificar que .open-next existe (debe existir tras el build)
if (!existsSync(outDir)) {
  console.error(`❌ El directorio ${outDir}/ no existe.`);
  console.error("   Ejecuta 'opennextjs-cloudflare build' antes de este script.");
  process.exit(1);
}

// Buscar el WASM en las ubicaciones posibles
let wasmFile = null;
for (const dir of searchDirs) {
  console.log(`🔍 Buscando ${wasmName} en ${dir}...`);
  wasmFile = findFile(dir, wasmName);
  if (wasmFile) {
    console.log(`   ✅ Encontrado: ${wasmFile}`);
    break;
  } else {
    console.log(`   ⬜ No encontrado en ${dir}`);
  }
}

if (wasmFile) {
  const dest = join(outDir, basename(wasmFile));
  cpSync(wasmFile, dest);

  // Verificar que se copió correctamente
  if (existsSync(dest)) {
    console.log(`📦 Copiado: ${wasmFile} → ${dest}`);
    console.log("━".repeat(50));
    console.log("✅ WASM listo para deploy");
  } else {
    console.error(`❌ Error: el archivo no se copió a ${dest}`);
    process.exit(1);
  }
} else {
  console.error("━".repeat(50));
  console.error(`❌ No se encontró ${wasmName} en ningún directorio de búsqueda.`);
  console.error("   Asegúrate de haber ejecutado 'prisma generate' antes del build.");
  console.error("   El schema usa 'runtime = \"workerd\"' que genera este archivo WASM.");
  process.exit(1);
}
