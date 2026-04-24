-- Seed: usuario admin inicial (owner)
-- Usuario: admin
-- Contraseña: admin123
-- IMPORTANTE: cambia la contraseña desde la app después del primer login.
--
-- Hash generado con Web Crypto API (PBKDF2-SHA-512, 10000 iter, 64 bytes)
-- usando la misma función hashPassword() de src/lib/auth.ts.
-- Formato: <salt_hex>:<derived_key_hex>

INSERT OR IGNORE INTO "User" (
  "id",
  "nickname",
  "email",
  "passwordHash",
  "role",
  "isPremium",
  "isBanned",
  "discordLinked",
  "locale",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-seed-0001',
  'admin',
  'admin@encoders.club',
  '51c9d4fd5d1786e604d986316423bc32:8994921a15716c7ef3a5981a2710278988fed76f68aea30f2b1c4310c988a070bb265254939f9e4ede1d9e2fa95950074a106e73809948098d0c5658f70d5bf5',
  'owner',
  1,
  0,
  0,
  'es',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
