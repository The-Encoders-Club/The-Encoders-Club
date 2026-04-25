// ============================================================
// Authentication Module - Web Crypto API for Cloudflare Workers
// ============================================================

// Generate random bytes using Web Crypto API
function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

// Convert Uint8Array to hex string
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Convert hex string to Uint8Array
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Hash password with salt using PBKDF2 (async - Web Crypto API)
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 10000,
      hash: 'SHA-512',
    },
    keyMaterial,
    512
  );
  const hashBytes = new Uint8Array(derivedBits);
  return `${toHex(salt)}:${toHex(hashBytes)}`;
}

// Verify password (async - Web Crypto API)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const parts = hashedPassword.split(':');
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  if (!saltHex || !hashHex) return false;

  try {
    const salt = fromHex(saltHex);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 10000,
        hash: 'SHA-512',
      },
      keyMaterial,
      512
    );
    const computedHash = toHex(new Uint8Array(derivedBits));
    return computedHash === hashHex;
  } catch {
    return false;
  }
}

// Generate remember token
export function generateRememberToken(): string {
  return toHex(randomBytes(32));
}

// Generate session token
export function generateSessionToken(): string {
  return toHex(randomBytes(32));
}

// Simple spam check - validate nickname
export function isValidNickname(nickname: string): boolean {
  return /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]{3,20}$/.test(nickname);
}

// Simple spam check - validate password
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Rate limit check using Cloudflare KV
export async function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): Promise<boolean> {
  try {
    const env = await (await import('./db')).getEnv();
    const key = `rate:${ip}`;
    const now = Date.now();
    const existing = await env.RATE_LIMITER.get(key);

    if (!existing) {
      await env.RATE_LIMITER.put(key, JSON.stringify({ count: 1, lastReset: now }), {
        expirationTtl: Math.ceil(windowMs / 1000),
      });
      return true;
    }

    const record = JSON.parse(existing);
    if (now - record.lastReset > windowMs) {
      await env.RATE_LIMITER.put(key, JSON.stringify({ count: 1, lastReset: now }), {
        expirationTtl: Math.ceil(windowMs / 1000),
      });
      return true;
    }

    if (record.count >= maxRequests) return false;
    record.count++;
    await env.RATE_LIMITER.put(key, JSON.stringify(record), {
      expirationTtl: Math.ceil(windowMs / 1000),
    });
    return true;
  } catch {
    // If KV fails, allow the request through (fail-open)
    return true;
  }
}
