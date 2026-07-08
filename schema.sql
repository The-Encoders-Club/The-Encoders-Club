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
  notificationEnabled INTEGER NOT NULL DEFAULT 1,
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

-- ============================================================
-- Dynamic Projects (admin-managed) — added in v0.3.0
-- Run this block ONCE in your D1 console (wrangler d1 execute) to
-- enable the "Proyectos" admin tab that lets you publish new
-- project pages without editing source code.
--
-- Slugs 'monika', 'natsuki' and 'yuri' are RESERVED for the
-- hardcoded projects in src/data/projects.ts and cannot be used
-- by dynamic projects (enforced at the API layer).
-- ============================================================

-- ============ SITE STATS (key/value counter table) ============
-- Already used by /api/stats and /api/admin/stats/config; create
-- here if it doesn't exist yet.
CREATE TABLE IF NOT EXISTS SiteStats (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
-- Seed the stat keys used by the app (idempotent)
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_visits', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_downloads', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('visits_base', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('downloads_base', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('external_downloads_base', 0);

-- ============ DYNAMIC PROJECTS ============
CREATE TABLE IF NOT EXISTS Project (
  id             TEXT PRIMARY KEY,                 -- slug (lowercase, url-safe, unique)
  name           TEXT NOT NULL,
  subtitle       TEXT,
  subtitleEn     TEXT,
  description    TEXT NOT NULL,
  descriptionEn  TEXT,
  image          TEXT NOT NULL,                    -- cover URL (R2 or external)
  coverBg        TEXT,                             -- optional cover background color (hex)
  coverFit       TEXT NOT NULL DEFAULT 'contain',  -- 'contain' | 'cover'
  tags           TEXT NOT NULL DEFAULT '[]',       -- JSON array of strings
  status         TEXT NOT NULL DEFAULT 'Disponible',
  statusEn       TEXT,
  statusColor    TEXT NOT NULL DEFAULT '#22c55e',
  rating         REAL NOT NULL DEFAULT 0,
  featured       INTEGER NOT NULL DEFAULT 0,
  previews       TEXT NOT NULL DEFAULT '[]',       -- JSON array of image URLs
  downloads      TEXT NOT NULL DEFAULT '[]',       -- JSON array of {label,labelEn,icon,url,color,hoverColor,textColor}
  music          TEXT,                             -- optional music: YouTube ID (11 chars), full URL, or direct MP3 URL
  details        TEXT NOT NULL DEFAULT '{}',       -- JSON: {playTime,playTimeEn,language,languageEn,engine,downloadsLabel}
  themeColor     TEXT NOT NULL DEFAULT '#FF2D78',
  bgImage        TEXT,                             -- optional full-page background image URL (R2 or external)
  bgFit          TEXT NOT NULL DEFAULT 'cover',    -- 'cover' | 'contain' | 'solid' (when only themeColor is used)
  -- Visual customization (all optional; fall back to themeColor when null)
  pageBgColor    TEXT,                             -- page background solid color (when bgFit='solid' or no bgImage)
  cardBgColor    TEXT,                             -- background color of cards (status, rating, details)
  borderColor    TEXT,                             -- border color of cards / sections (defaults to themeColor)
  textColor      TEXT,                             -- main text color (defaults to #1a1a1a)
  titleStrokeColor TEXT,                           -- stroke color for RifficFree titles (defaults to themeColor)
  accentColor    TEXT,                             -- secondary accent for icons / links
  sections       TEXT NOT NULL DEFAULT '{}',       -- JSON: {showGallery,showResources,showComments,showDetails,showMusic,showShare,showFeaturedBadge} (all bool, default true)
  resources      TEXT NOT NULL DEFAULT '[]',       -- JSON array of {title,description,url,icon,color} for the "Recursos" section
  isPublished    INTEGER NOT NULL DEFAULT 1,
  sortOrder      INTEGER NOT NULL DEFAULT 0,
  createdAt      TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_project_published ON Project(isPublished, sortOrder);
CREATE INDEX IF NOT EXISTS idx_project_featured ON Project(featured, isPublished);

-- ============================================================
-- Migration: add columns added in v0.4.0 (visual customization + sections + resources)
-- Run ONCE if you already created the Project table before v0.4.0.
-- Pick ONLY the lines for columns you don't have yet.
-- ============================================================
-- ALTER TABLE Project ADD COLUMN bgImage TEXT;
-- ALTER TABLE Project ADD COLUMN bgFit TEXT NOT NULL DEFAULT 'cover';
-- ALTER TABLE Project ADD COLUMN pageBgColor TEXT;
-- ALTER TABLE Project ADD COLUMN cardBgColor TEXT;
-- ALTER TABLE Project ADD COLUMN borderColor TEXT;
-- ALTER TABLE Project ADD COLUMN textColor TEXT;
-- ALTER TABLE Project ADD COLUMN titleStrokeColor TEXT;
-- ALTER TABLE Project ADD COLUMN accentColor TEXT;
-- ALTER TABLE Project ADD COLUMN sections TEXT NOT NULL DEFAULT '{}';
-- ALTER TABLE Project ADD COLUMN resources TEXT NOT NULL DEFAULT '[]';
