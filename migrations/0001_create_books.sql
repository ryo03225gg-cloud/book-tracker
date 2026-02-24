CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  status TEXT DEFAULT '読みたい',
  created_at TEXT DEFAULT (datetime('now'))
);
