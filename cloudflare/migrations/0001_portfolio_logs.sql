-- Initial schema based on the fields written by the existing Vercel routes.
-- Compare against the source PostgreSQL schema before importing historic data.
CREATE TABLE user_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    user_forward_ip TEXT,
    user_remote_ip TEXT,
    header_language TEXT,
    from_page TEXT,
    section_id TEXT,
    event TEXT,
    start_at TEXT,
    user_agent TEXT
) STRICT;

CREATE TABLE user_ai_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    user_prompt TEXT,
    ai_model TEXT,
    ai_output TEXT,
    user_remote_addr TEXT
) STRICT;
