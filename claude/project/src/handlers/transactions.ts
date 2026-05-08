import type { Env } from '../types/index.js';
import { ok, err } from '../utils/response.js';
import { kvGet, kvSet, cacheKey } from '../utils/kv.js';
import { CreateTransactionSchema, validationProblem } from '../utils/validation.js';

const FX_CACHE_TTL = 5 * 60;

export async function handleListTransactions(request: Request, env: Env, userId: string): Promise<Response> {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1', 10);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 100);
  const status = url.searchParams.get('status');
  const offset = (page - 1) * limit;

  const whereClause = status
    ? 'WHERE (a.user_id = ?) AND t.status = ?'
    : 'WHERE a.user_id = ?';
  const bindings = status ? [userId, status, limit, offset] : [userId, limit, offset];

  const { results } = await env.DB.prepare(
    `SELECT DISTINCT t.* FROM transactions t
     JOIN accounts a ON (t.sender_account_id = a.id OR t.receiver_account_id = a.id)
     ${whereClause}
     ORDER BY t.created_at DESC LIMIT ? OFFSET ?`
  ).bind(...bindings).all();

  return ok({ transactions: results, page, limit });
}

export async function handleGetTransaction(env: Env, userId: string, txnId: string): Promise<Response> {
  const txn = await env.DB.prepare(
    `SELECT t.* FROM transactions t
     JOIN accounts a ON (t.sender_account_id = a.id OR t.receiver_account_id = a.id)
     WHERE t.id = ? AND a.user_id = ? LIMIT 1`
  ).bind(txnId, userId).first();
  if (!txn) return err('Transaction not found', 404);
  return ok(txn);
}

export async function handleCreateTransaction(request: Request, env: Env, userId: string): Promise<Response> {
  const rawBody = await request.json().catch(() => null);
  const parsed = CreateTransactionSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  const senderAccount = await env.DB.prepare(
    'SELECT * FROM accounts WHERE id = ? AND user_id = ?'
  ).bind(body.sender_account_id, userId).first<{ balance: number }>();
  if (!senderAccount) return err('Sender account not found', 404);
  if (senderAccount.balance < body.amount) return err('Insufficient balance', 422);

  const id = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO transactions (id, sender_account_id, receiver_account_id, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, body.sender_account_id, body.receiver_account_id, body.amount, body.currency.toUpperCase(), 'pending').run();

  const txn = await env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
  return ok(txn, 201);
}

export async function handleGetFxRate(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const from = url.searchParams.get('from')?.toUpperCase();
  const to = url.searchParams.get('to')?.toUpperCase();
  if (!from || !to) return err('from and to currency parameters are required', 422);

  const ck = cacheKey('fx', `${from}-${to}`);
  const cached = await kvGet<{ rate: number; timestamp: string }>(env.CACHE, ck);
  if (cached) return ok({ from, to, rate: cached.rate, cached: true, timestamp: cached.timestamp });

  // Fallback mock rate — replace with real FX API call when FX_API_KEY is available
  const mockRates: Record<string, number> = { 'GBP-USD': 1.27, 'USD-GBP': 0.79, 'GBP-EUR': 1.17, 'EUR-GBP': 0.86, 'USD-EUR': 0.92, 'EUR-USD': 1.09 };
  const rate = mockRates[`${from}-${to}`] ?? 1.0;
  const timestamp = new Date().toISOString();

  await kvSet(env.CACHE, ck, { rate, timestamp }, FX_CACHE_TTL);
  return ok({ from, to, rate, cached: false, timestamp });
}
