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

// Generate a unique recovery code in format XXXX-XXXX-XXXX-XXXX (A-Z, 0-9)
export function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const groups: string[] = [];
  for (let g = 0; g < 4; g++) {
    let group = '';
    for (let i = 0; i < 4; i++) {
      group += chars[Math.floor(Math.random() * chars.length)];
    }
    groups.push(group);
  }
  return groups.join('-');
}

// Hash a security answer or recovery code using PBKDF2 (same as passwords)
// Uses SHA-256 with fewer iterations since answers/codes are not passwords
export async function hashSecurityData(data: string): Promise<string> {
  const salt = randomBytes(16);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(data.toLowerCase().trim()),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 5000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const hashBytes = new Uint8Array(derivedBits);
  return `${toHex(salt)}:${toHex(hashBytes)}`;
}

// Verify a security answer or recovery code against its hash
export async function verifySecurityData(data: string, hashedData: string): Promise<boolean> {
  const parts = hashedData.split(':');
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  if (!saltHex || !hashHex) return false;

  try {
    const salt = fromHex(saltHex);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(data.toLowerCase().trim()),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 5000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );
    const computedHash = toHex(new Uint8Array(derivedBits));
    return computedHash === hashHex;
  } catch {
    return false;
  }
}

// Security questions available for selection
export const SECURITY_QUESTIONS = [
  { value: 'pet_name', label_es: '¿Cuál es el nombre de tu primera mascota?', label_en: 'What is the name of your first pet?' },
  { value: 'birth_city', label_es: '¿En qué ciudad naciste?', label_en: 'What city were you born in?' },
  { value: 'first_school', label_es: '¿Cuál fue el nombre de tu primera escuela?', label_en: 'What was the name of your first school?' },
  { value: 'favorite_food', label_es: '¿Cuál es tu comida favorita?', label_en: 'What is your favorite food?' },
  { value: 'childhood_friend', label_es: '¿Cómo se llamaba tu mejor amigo de la infancia?', label_en: "What was your childhood best friend's name?" },
  { value: 'favorite_movie', label_es: '¿Cuál es tu película favorita?', label_en: 'What is your favorite movie?' },
  { value: 'mother_maiden', label_es: '¿Cuál es el apellido de soltera de tu madre?', label_en: "What is your mother's maiden name?" },
  { value: 'first_car', label_es: '¿Cuál fue la marca de tu primer auto?', label_en: 'What was the make of your first car?' },
] as const;

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
