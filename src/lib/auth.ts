import crypto from 'crypto';

// Hash password with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;
  const verify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// Generate remember token
export function generateRememberToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
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
