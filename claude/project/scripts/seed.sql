-- Dev/Staging seed data
INSERT OR IGNORE INTO users (id, email, phone, hashed_password, full_name, kyc_status) VALUES
  ('user-001', 'alice@example.com', '+447700900001', '$argon2id$seed-hash-alice', 'Alice Johnson', 'approved'),
  ('user-002', 'bob@example.com', '+447700900002', '$argon2id$seed-hash-bob', 'Bob Smith', 'pending'),
  ('user-003', 'carol@example.com', '+447700900003', '$argon2id$seed-hash-carol', 'Carol Williams', 'approved');

INSERT OR IGNORE INTO accounts (id, user_id, currency, balance, account_type) VALUES
  ('acc-001', 'user-001', 'GBP', 5000.00, 'personal'),
  ('acc-002', 'user-001', 'USD', 2500.00, 'personal'),
  ('acc-003', 'user-002', 'EUR', 1200.00, 'personal'),
  ('acc-004', 'user-003', 'GBP', 8750.00, 'personal'),
  ('acc-005', 'user-003', 'USD', 3300.00, 'business');

INSERT OR IGNORE INTO transactions (id, sender_account_id, receiver_account_id, amount, currency, fx_rate, status, reference) VALUES
  ('txn-001', 'acc-001', 'acc-004', 500.00, 'GBP', 1.0, 'completed', 'ref-abc001'),
  ('txn-002', 'acc-002', 'acc-005', 200.00, 'USD', 0.79, 'completed', 'ref-abc002'),
  ('txn-003', 'acc-004', 'acc-001', 150.00, 'GBP', 1.0, 'pending', 'ref-abc003'),
  ('txn-004', 'acc-001', 'acc-003', 300.00, 'GBP', 1.17, 'completed', 'ref-abc004'),
  ('txn-005', 'acc-005', 'acc-002', 750.00, 'USD', 1.0, 'processing', 'ref-abc005');

-- Exchange rate seed data
INSERT OR IGNORE INTO exchange_rates (id, from_currency, to_currency, rate, source) VALUES
  ('fx-001', 'GBP', 'USD', 1.27, 'seed'),
  ('fx-002', 'USD', 'GBP', 0.79, 'seed'),
  ('fx-003', 'GBP', 'EUR', 1.17, 'seed'),
  ('fx-004', 'EUR', 'GBP', 0.86, 'seed'),
  ('fx-005', 'USD', 'EUR', 0.92, 'seed'),
  ('fx-006', 'EUR', 'USD', 1.09, 'seed');
