CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_text TEXT NOT NULL,
    prediction TEXT NOT NULL,
    confidence REAL NOT NULL,
    created_at TEXT NOT NULL
);
