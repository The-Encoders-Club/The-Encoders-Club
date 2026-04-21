// ============================================================
// Edge-compatible auth utilities using Web Crypto API
// Replaces Node.js 'crypto' module for Cloudflare Workers/Pages
// ============================================================

// Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hash password with salt using Web Crypto PBKDF2 (async)
// Maintains backward compatibility with existing salt:hash format
export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 10000,
      hash: 'SHA-512',
    },
    keyMaterial,
    512, // 512 bits = 64 bytes (same as the original crypto.pbkdf2Sync with 64)
  );

  return `${arrayBufferToHex(salt)}:${arrayBufferToHex(derivedBits)}`;
}

// Verify password using Web Crypto PBKDF2 (async)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [saltHex, hashHex] = hashedPassword.split(':');
  if (!saltHex || !hashHex) return false;

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToArrayBuffer(saltHex),
      iterations: 10000,
      hash: 'SHA-512',
    },
    keyMaterial,
    512,
  );

  return hashHex === arrayBufferToHex(derivedBits);
}

// Generate remember token using Web Crypto (sync - Edge compatible)
export function generateRememberToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return arrayBufferToHex(bytes.buffer);
}

// Generate session token using Web Crypto (sync - Edge compatible)
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return arrayBufferToHex(bytes.buffer);
}

// Simple spam check - validate nickname
export function isValidNickname(nickname: string): boolean {
  return /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]{3,20}$/.test(nickname);
}

// Simple spam check - validate password
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Rate limit check (in-memory, simple)
const rateLimits = new Map<string, { count: number; lastReset: number }>();
export function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
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
