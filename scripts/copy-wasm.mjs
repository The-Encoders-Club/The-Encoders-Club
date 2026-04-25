/**
 * copy-wasm.mjs
 *
 * Prepara el WASM de Prisma para deploy en Cloudflare Workers.
 *
 * PROBLEMA: Next.js/webpack convierte los imports ESM de WASM en
 * require() con rutas absolutas o con hashes. Cloudflare Workers
 * NO soporta require() — solo import (ESM).
 *
 * SOLUCIÓN:
 *   1. Copiar query_engine_bg.wasm junto a handler.mjs
 *   2. Agregar `import __queryEngineWasm from "./query_engine_bg.wasm";`
 *      al inicio de handler.mjs
 *   3. Reemplazar TODOS los require("...query_engine_bg.wasm...")
 *      con la variable __queryEngineWasm
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

console.log("━".repeat(58));
console.log("📋 copy-wasm.mjs — Preparando WASM de Prisma para deploy");
console.log("━".repeat(58));

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
  console.error("━".repeat(58));
  console.error(`❌ No se encontró ${wasmName} en ningún directorio.`);
  console.error("   Ejecuta 'prisma generate' antes del build.");
  process.exit(1);
}

// ── PASO 3: Copiar WASM junto a handler.mjs ─────────────────────
const handlerDir = join(outDir, "server-functions", "default");

// Copiar al directorio del handler (donde se necesita el import)
if (existsSync(handlerDir)) {
  const handlerWasmDest = join(handlerDir, basename(wasmFile));
  cpSync(wasmFile, handlerWasmDest);
  console.log(`📦 Copiado: ${wasmFile} → ${handlerWasmDest}`);
}

// También copiar junto a worker.js (por si acaso)
const rootWasmDest = join(outDir, basename(wasmFile));
cpSync(wasmFile, rootWasmDest);
console.log(`📦 Copiado: ${wasmFile} → ${rootWasmDest}`);

// ── PASO 4: Post-procesar handler.mjs ────────────────────────────
// Cloudflare Workers NO soporta require() — solo import (ESM).
// Reemplazamos todos los require("...query_engine_bg.wasm...")
// con una variable importada al inicio del archivo.
if (existsSync(handlerPath)) {
  console.log(`\n🔧 Post-procesando ${handlerPath}...`);
  let handlerContent = readFileSync(handlerPath, "utf-8");

  // Buscar TODAS las llamadas require() que referencien al WASM
  // Esto incluye rutas absolutas, relativas, con hash, con ?module, etc.
  const wasmRequireRegex = /require\(\s*["'][^"']*query_engine_bg\.wasm[^"']*["']\s*\)/g;
  const matches = handlerContent.match(wasmRequireRegex);

  if (matches && matches.length > 0) {
    console.log(`   🔎 Encontradas ${matches.length} llamadas require() al WASM`);

    // Agregar import ESM al inicio del archivo
    const importStatement = 'import __queryEngineWasm from "./query_engine_bg.wasm";\n';

    // Reemplazar TODOS los require() con la variable importada
    // Antes: require("/opt/buildhome/.../query_engine_bg.wasm")
    // Antes: require("./232a8c06...-query_engine_bg.wasm")
    // Después: __queryEngineWasm
    handlerContent = handlerContent.replace(
      wasmRequireRegex,
      "__queryEngineWasm"
    );

    // Agregar el import al inicio
    handlerContent = importStatement + handlerContent;

    writeFileSync(handlerPath, handlerContent, "utf-8");
    console.log(`   ✅ Reemplazadas ${matches.length} require() → __queryEngineWasm`);
    console.log(`   ✅ Import ESM agregado al inicio del archivo`);
  } else {
    console.log("   ℹ️  No se encontraron require() al WASM (ya usa import)");
  }
} else {
  console.log(`\n⚠️  No se encontró ${handlerPath} — se omite post-procesamiento`);
}

// ── PASO 5: Verificación final ───────────────────────────────────
let allGood = true;

if (!existsSync(rootWasmDest)) {
  console.error(`\n❌ Falta: ${rootWasmDest}`);
  allGood = false;
}

const handlerWasmPath = join(handlerDir, basename(wasmFile));
if (existsSync(handlerDir) && !existsSync(handlerWasmPath)) {
  console.error(`\n❌ Falta: ${handlerWasmPath}`);
  allGood = false;
}

if (allGood) {
  console.log("\n" + "━".repeat(58));
  console.log("✅ WASM listo para deploy");
  console.log("━".repeat(58));
} else {
  console.error("\n❌ Verificación fallida — revisa los errores arriba");
  process.exit(1);
}
