/**
 * copy-wasm.mjs
 *
 * Busca el archivo query_engine_bg.wasm generado por Prisma, lo copia
 * al directorio .open-next/ y TAMBIÉN reescribe las rutas absolutas
 * al WASM dentro de handler.mjs para que Wrangler pueda resolverlas.
 *
 * El problema: Next.js copia el WASM a cada ruta de API durante el build
 * y genera require() con rutas absolutas del sistema de archivos del
 * servidor de build. Wrangler no puede resolver esas rutas. Este script
 * las reemplaza por una ruta relativa "./query_engine_bg.wasm".
 *
 * Uso:  node scripts/copy-wasm.mjs
 * Se ejecuta automáticamente como parte de `npm run cf:build`.
 */
import { cpSync, existsSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

/**
 * Busca recursivamente un archivo por nombre dentro de un directorio.
 */
function findFile(dir, name) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
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
const handlerPath = join(outDir, "server-functions", "default", "handler.mjs");

console.log("━".repeat(55));
console.log("📋 copy-wasm.mjs — Preparando WASM de Prisma para deploy");
console.log("━".repeat(55));

// ── PASO 1: Verificar que .open-next existe ──────────────────────
if (!existsSync(outDir)) {
  console.error(`❌ El directorio ${outDir}/ no existe.`);
  console.error("   Ejecuta 'opennextjs-cloudflare build' antes de este script.");
  process.exit(1);
}

// ── PASO 2: Buscar el archivo WASM ───────────────────────────────
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

if (!wasmFile) {
  console.error("━".repeat(55));
  console.error(`❌ No se encontró ${wasmName} en ningún directorio.`);
  console.error("   Ejecuta 'prisma generate' antes del build.");
  process.exit(1);
}

// ── PASO 3: Copiar WASM a .open-next/ (junto a worker.js) ───────
const wasmDest = join(outDir, basename(wasmFile));
cpSync(wasmFile, wasmDest);
console.log(`📦 Copiado: ${wasmFile} → ${wasmDest}`);

// ── PASO 4: Copiar WASM junto a handler.mjs ─────────────────────
const handlerDir = join(outDir, "server-functions", "default");
if (existsSync(handlerDir)) {
  const handlerWasmDest = join(handlerDir, basename(wasmFile));
  cpSync(wasmFile, handlerWasmDest);
  console.log(`📦 Copiado: ${wasmFile} → ${handlerWasmDest}`);
} else {
  console.log(`⚠️  No se encontró ${handlerDir}/ — se omite copia junto a handler`);
}

// ── PASO 5: Reescribir rutas WASM absolutas en handler.mjs ──────
// Next.js genera require() con rutas absolutas como:
//   require("/opt/buildhome/repo/.next/server/app/api/auth/register/query_engine_bg.wasm")
// Eso causa ENOENT en Wrangler. Lo reemplazamos por "./query_engine_bg.wasm"
if (existsSync(handlerPath)) {
  console.log(`\n🔧 Post-procesando ${handlerPath}...`);
  let handlerContent = readFileSync(handlerPath, "utf-8");

  // Contar cuántas rutas absolutas al WASM hay
  const absoluteWasmRegex = /require\(["'][^"']*query_engine_bg\.wasm[^"']*["']\)/g;
  const matches = handlerContent.match(absoluteWasmRegex);

  if (matches && matches.length > 0) {
    console.log(`   🔎 Encontradas ${matches.length} rutas absolutas al WASM`);

    // Reemplazar TODAS las rutas absolutas con relativa
    handlerContent = handlerContent.replace(
      /require\(["'][^"']*query_engine_bg\.wasm(?:\?module)?["']\)/g,
      'require("./query_engine_bg.wasm")'
    );

    writeFileSync(handlerPath, handlerContent, "utf-8");
    console.log(`   ✅ Reescritas ${matches.length} rutas → require("./query_engine_bg.wasm")`);
  } else {
    console.log("   ℹ️  No se encontraron rutas absolutas al WASM (ya está correcto)");
  }
} else {
  console.log(`\n⚠️  No se encontró ${handlerPath} — se omite post-procesamiento`);
}

// ── PASO 6: Verificación final ───────────────────────────────────
let allGood = true;

if (!existsSync(wasmDest)) {
  console.error(`\n❌ Falta: ${wasmDest}`);
  allGood = false;
}

const handlerWasmPath = join(handlerDir, basename(wasmFile));
if (existsSync(handlerDir) && !existsSync(handlerWasmPath)) {
  console.error(`\n❌ Falta: ${handlerWasmPath}`);
  allGood = false;
}

if (allGood) {
  console.log("\n" + "━".repeat(55));
  console.log("✅ WASM listo para deploy");
  console.log("━".repeat(55));
} else {
  console.error("\n❌ Verificación fallida — revisa los errores arriba");
  process.exit(1);
}
