CREATE TABLE IF NOT EXISTS exchange_rates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate REAL NOT NULL CHECK (rate > 0),
  source TEXT NOT NULL DEFAULT 'system',
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (from_currency, to_currency, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_recorded_at ON exchange_rates(recorded_at);
