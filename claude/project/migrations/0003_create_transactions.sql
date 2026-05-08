CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  sender_account_id TEXT NOT NULL REFERENCES accounts(id),
  receiver_account_id TEXT NOT NULL REFERENCES accounts(id),
  amount REAL NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL,
  fx_rate REAL NOT NULL DEFAULT 1.0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  reference TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(8)))),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON transactions(receiver_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
