/**
 * auth.ts — Cryptographic helpers compatible with Cloudflare Workers.
 *
 * Cloudflare Workers supports the Web Crypto API natively (no flag needed).
 * The Node.js `crypto` module is also available via `nodejs_compat`, but
 * `crypto.pbkdf2Sync` is a synchronous, CPU-intensive operation that can
 * cause issues in the Workers runtime. We use the Web Crypto API instead,
 * which is async and fully supported without any compatibility flags.
 *
 * Password format: "<hex-salt>:<hex-derived-key>"
 * - salt: 16 random bytes → 32 hex chars
 * - key:  64 derived bytes → 128 hex chars  (PBKDF2-SHA-512, 10 000 iter)
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return arr;
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 10000,
      hash: "SHA-512",
    },
    keyMaterial,
    512 // 64 bytes
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Hash a plain-text password. Returns "<salt>:<hash>" (both hex-encoded). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveKey(password, salt);
  return `${bufToHex(salt)}:${bufToHex(derived)}`;
}

/** Verify a plain-text password against a stored "<salt>:<hash>" string. */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = hexToBuf(saltHex);
  const derived = await deriveKey(password, salt);
  return bufToHex(derived) === hashHex;
}

/** Generate a cryptographically-random token (hex string, 64 chars). */
export function generateRememberToken(): string {
  return bufToHex(crypto.getRandomValues(new Uint8Array(32)));
}

/** Generate a cryptographically-random session token (hex string, 64 chars). */
export function generateSessionToken(): string {
  return bufToHex(crypto.getRandomValues(new Uint8Array(32)));
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export function isValidNickname(nickname: string): boolean {
  return /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]{3,20}$/.test(nickname);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// ---------------------------------------------------------------------------
// In-memory rate limiter (per-isolate, resets on cold start)
// ---------------------------------------------------------------------------
const rateLimits = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now - record.lastReset > windowMs) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}
