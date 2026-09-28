PRAGMA foreign_keys = ON;

-- Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL DEFAULT 100000,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_account ON sessions(account_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Cloud Saves
CREATE TABLE IF NOT EXISTS cloud_saves (
  account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  save_data TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  client_updated_at INTEGER,
  updated_at INTEGER NOT NULL
);

-- Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id TEXT PRIMARY KEY,
  challenge_date TEXT NOT NULL UNIQUE,
  seed TEXT NOT NULL,
  special_rules TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);

-- Daily Runs
CREATE TABLE IF NOT EXISTS daily_runs (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  revenue INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  finished_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_daily_runs_challenge_score ON daily_runs(challenge_id, score DESC, finished_at ASC);
CREATE INDEX IF NOT EXISTS idx_daily_runs_account ON daily_runs(account_id);

-- Endless Runs
CREATE TABLE IF NOT EXISTS endless_runs (
  id TEXT PRIMARY KEY,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  days_survived INTEGER NOT NULL DEFAULT 0,
  total_revenue INTEGER NOT NULL DEFAULT 0,
  final_reputation INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  finished_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_endless_runs_score ON endless_runs(score DESC, finished_at ASC);
CREATE INDEX IF NOT EXISTS idx_endless_runs_account ON endless_runs(account_id);

-- Unified Leaderboard Entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- 'campaign', 'endless', 'daily', 'reputation'
  period TEXT NOT NULL,   -- 'all-time' or 'YYYY-MM-DD'
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  secondary_metric INTEGER NOT NULL DEFAULT 0,
  metadata TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leaderboard_cat_period_score ON leaderboard_entries(category, period, score DESC, created_at ASC);

-- Run Tokens (Single-use nonce for verifying run starts and finishes)
CREATE TABLE IF NOT EXISTS run_tokens (
  token_nonce TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  challenge_id TEXT,
  account_id TEXT,
  seed TEXT NOT NULL,
  issued_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_run_tokens_nonce ON run_tokens(token_nonce);
CREATE INDEX IF NOT EXISTS idx_run_tokens_expires ON run_tokens(expires_at);

-- Rate Limits
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);
