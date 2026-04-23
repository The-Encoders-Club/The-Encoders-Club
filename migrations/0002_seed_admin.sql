-- Seed: usuario admin inicial
-- Usuario: admin
-- Contraseña: admin123
-- IMPORTANTE: cambia la contraseña desde la app después del primer login.
-- Si necesitas regenerar el hash con otra contraseña, hazlo localmente con
-- la función hashPassword() en src/lib/auth.ts.

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
  '51c9d4fd5d1786e604d986316423bc32:0c81b30c6af52def12d03f0ed3c91a06c52893b7e7993e3b8902e2eedd1afdb50f37441ef3dcbe9e5921f98c4b9119ab7d27dc410bb510c4e680916a8bde2af9',
  'owner',
  1,
  0,
  0,
  'es',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
