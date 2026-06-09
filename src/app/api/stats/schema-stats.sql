CREATE TABLE IF NOT EXISTS SiteStats (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_visits', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('total_downloads', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('visits_base', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('downloads_base', 0);
INSERT OR IGNORE INTO SiteStats (key, value) VALUES ('external_downloads_base', 0);
