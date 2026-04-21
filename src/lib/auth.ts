// Cloudflare Workers compatible auth utilities using Web Crypto API
// Replaces Node.js crypto module

// Hash password with salt using PBKDF2
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
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
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `v2:${saltHex}:${hashHex}`;
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    if (hashedPassword.startsWith('v2:')) {
      // New Web Crypto format
      const parts = hashedPassword.split(':');
      if (parts.length !== 3) return false;
      const salt = new Uint8Array(parts[1].match(/.{2}/g)!.map(b => parseInt(b, 16)));
      const expectedHash = parts[2];
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
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );
      const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === expectedHash;
    } else {
      // Legacy Node.js crypto format (pbkdf2Sync with sha512)
      const [salt, hash] = hashedPassword.split(':');
      if (!salt || !hash) return false;
      const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(b => parseInt(b, 16)));
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
          salt: saltBytes,
          iterations: 10000,
          hash: 'SHA-512',
        },
        keyMaterial,
        512
      );
      const verifyHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
      return hash === verifyHex;
    }
  } catch {
    return false;
  }
}

// Generate random hex token
export function generateToken(bytes: number = 32): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate remember token
export function generateRememberToken(): string {
  return generateToken(32);
}

// Generate session token
export function generateSessionToken(): string {
  return generateToken(32);
}

// Validate nickname
export function isValidNickname(nickname: string): boolean {
  return /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]{3,20}$/.test(nickname);
}

// Validate password
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Generate unique ID (CUID-like)
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint8Array(8));
  const randomStr = Array.from(random).map(b => b.toString(36)).join('').slice(0, 12);
  return `${timestamp}${randomStr}`;
}

// Note: Rate limiting removed for Cloudflare Workers (stateless environment)
// Use Cloudflare's built-in rate limiting or D1-based rate limiting instead
export function checkRateLimit(_ip: string, _maxRequests: number = 10, _windowMs: number = 60000): boolean {
  // In Cloudflare Workers, use Cloudflare Rate Limiting API
  // or implement D1-based rate limiting
  // For now, always returns true (no rate limiting)
  return true;
}
