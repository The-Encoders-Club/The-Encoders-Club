-- ============================================================
-- The Encoders Club - D1 Database Schema
-- Compatible with Cloudflare D1 (SQLite)
-- ============================================================

-- ============ USERS ============
CREATE TABLE IF NOT EXISTS User (
  id            TEXT PRIMARY KEY,
  nickname      TEXT NOT NULL UNIQUE,
  email         TEXT UNIQUE,
  passwordHash  TEXT NOT NULL,
  avatar        TEXT DEFAULT NULL,
  role          TEXT NOT NULL DEFAULT 'user',
  isPremium     INTEGER NOT NULL DEFAULT 0,
  isBanned      INTEGER NOT NULL DEFAULT 0,
  banReason     TEXT,
  discordId     TEXT UNIQUE,
  discordLinked INTEGER NOT NULL DEFAULT 0,
  locale        TEXT NOT NULL DEFAULT 'es',
  rememberToken      TEXT UNIQUE,
  discordAccessToken  TEXT,
  discordRefreshToken TEXT,
  createdAt          TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============ COMMENTS ============
CREATE TABLE IF NOT EXISTS Comment (
  id          TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  authorId    TEXT NOT NULL,
  parentId    TEXT,
  targetId    TEXT NOT NULL,
  targetType  TEXT NOT NULL DEFAULT 'project',
  isDeleted   INTEGER NOT NULL DEFAULT 0,
  isReported  INTEGER NOT NULL DEFAULT 0,
  reportCount INTEGER NOT NULL DEFAULT 0,
  likes       INTEGER NOT NULL DEFAULT 0,
  createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt   TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (authorId) REFERENCES User(id),
  FOREIGN KEY (parentId) REFERENCES Comment(id)
);

-- ============ REACTIONS ============
CREATE TABLE IF NOT EXISTS Reaction (
  id        TEXT PRIMARY KEY,
  type      TEXT NOT NULL,
  userId    TEXT NOT NULL,
  commentId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (commentId) REFERENCES Comment(id),
  UNIQUE(userId, commentId, type)
);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS Notification (
  id        TEXT PRIMARY KEY,
  userId    TEXT NOT NULL,
  type      TEXT NOT NULL,
  title     TEXT NOT NULL,
  message   TEXT NOT NULL,
  isRead    INTEGER NOT NULL DEFAULT 0,
  link      TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- ============ ACTIVITY LOGS ============
CREATE TABLE IF NOT EXISTS ActivityLog (
  id        TEXT PRIMARY KEY,
  userId    TEXT,
  action    TEXT NOT NULL,
  details   TEXT,
  ipAddress TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- ============ DISCORD CONFIG ============
CREATE TABLE IF NOT EXISTS DiscordConfig (
  id                 TEXT PRIMARY KEY,
  botToken           TEXT,
  serverId           TEXT,
  channelId          TEXT,
  webhookUrl         TEXT,
  modRoleId          TEXT,
  adminRoleId        TEXT,
  collabRoleId       TEXT,
  discordClientId    TEXT,
  discordClientSecret TEXT,
  siteUrl            TEXT,
  createdAt          TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============ DONATIONS ============
CREATE TABLE IF NOT EXISTS Donation (
  id        TEXT PRIMARY KEY,
  userId    TEXT,
  nickname  TEXT NOT NULL,
  amount    REAL NOT NULL,
  currency  TEXT NOT NULL DEFAULT 'USD',
  platform  TEXT NOT NULL DEFAULT 'ko-fi',
  message   TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_comment_target ON Comment(targetId, targetType);
CREATE INDEX IF NOT EXISTS idx_comment_author ON Comment(authorId);
CREATE INDEX IF NOT EXISTS idx_comment_parent ON Comment(parentId);
CREATE INDEX IF NOT EXISTS idx_notification_user ON Notification(userId);
CREATE INDEX IF NOT EXISTS idx_activity_user ON ActivityLog(userId);
CREATE INDEX IF NOT EXISTS idx_donation_created ON Donation(createdAt);
CREATE INDEX IF NOT EXISTS idx_user_nickname ON User(nickname);
CREATE INDEX IF NOT EXISTS idx_user_remember ON User(rememberToken);
CREATE INDEX IF NOT EXISTS idx_user_discord ON User(discordId);
CREATE INDEX IF NOT EXISTS idx_user_discord_linked ON User(discordLinked);

-- ============================================================
-- Migration: Add new columns to existing tables (run manually)
-- ============================================================
-- ALTER TABLE User ADD COLUMN discordAccessToken TEXT;
-- ALTER TABLE User ADD COLUMN discordRefreshToken TEXT;
-- ALTER TABLE DiscordConfig ADD COLUMN discordClientId TEXT;
-- ALTER TABLE DiscordConfig ADD COLUMN discordClientSecret TEXT;
-- ALTER TABLE DiscordConfig ADD COLUMN siteUrl TEXT;
-- ALTER TABLE DiscordConfig ADD COLUMN notificationEnabled INTEGER NOT NULL DEFAULT 1;

-- ============ COMMENT REPORTS (prevent duplicate reports) ============
CREATE TABLE IF NOT EXISTS CommentReport (
  id        TEXT PRIMARY KEY,
  userId    TEXT NOT NULL,
  commentId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (commentId) REFERENCES Comment(id),
  UNIQUE(userId, commentId)
);
CREATE INDEX IF NOT EXISTS idx_comment_report_user ON CommentReport(userId);
CREATE INDEX IF NOT EXISTS idx_comment_report_comment ON CommentReport(commentId);

-- ============================================================
-- Migration: Password Recovery System (run manually)
-- ============================================================
-- ALTER TABLE User ADD COLUMN securityQuestion TEXT;
-- ALTER TABLE User ADD COLUMN securityAnswerHash TEXT;
-- ALTER TABLE User ADD COLUMN recoveryCodeHash TEXT;
-- CREATE INDEX IF NOT EXISTS idx_user_recovery_code ON User(recoveryCodeHash);
