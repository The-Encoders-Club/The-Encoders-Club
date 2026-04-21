-- The Encoders Club - D1 Migration
-- Run with: wrangler d1 execute encoders-club-db --file=./drizzle/migrations/0001_initial.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_premium INTEGER NOT NULL DEFAULT 0,
  is_banned INTEGER NOT NULL DEFAULT 0,
  ban_reason TEXT,
  discord_id TEXT UNIQUE,
  discord_linked INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'es',
  remember_token TEXT UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES users(id),
  parent_id TEXT,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  is_reported INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Reactions
CREATE TABLE IF NOT EXISTS reactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  comment_id TEXT NOT NULL REFERENCES comments(id),
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS reactions_user_comment_type ON reactions(user_id, comment_id, type);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at TEXT NOT NULL
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

-- Discord Configs
CREATE TABLE IF NOT EXISTS discord_configs (
  id TEXT PRIMARY KEY,
  bot_token TEXT,
  server_id TEXT,
  channel_id TEXT,
  webhook_url TEXT,
  mod_role_id TEXT,
  admin_role_id TEXT,
  collab_role_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  nickname TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  platform TEXT NOT NULL DEFAULT 'ko-fi',
  message TEXT,
  created_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
