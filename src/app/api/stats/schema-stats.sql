-- ============================================================
-- Migration: SiteStats (Run once to add stats tracking)
-- ============================================================
-- Execute this in your D1 database:
-- wrangler d1 execute encoders-club-db --remote --file=src/api/stats/schema-stats.sql
-- Or for local dev:
-- wrangler d1 execute encoders-club-db --local --file=src/api/stats/schema-stats.sql

CREATE TABLE IF NOT EXISTS SiteStats (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

-- Initialize counters (INSERT OR IGNORE won't overwrite if already exist)
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_visits', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_downloads', 0);

