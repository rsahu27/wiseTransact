import type { Env } from '../types/index.js';
import { ok, err } from '../utils/response.js';
import { CreateAccountSchema, validationProblem } from '../utils/validation.js';

export async function handleListAccounts(env: Env, userId: string): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();
  return ok(results);
}

export async function handleGetAccount(env: Env, userId: string, accountId: string): Promise<Response> {
  const account = await env.DB.prepare(
    'SELECT * FROM accounts WHERE id = ? AND user_id = ?'
  ).bind(accountId, userId).first();
  if (!account) return err('Account not found', 404);
  return ok(account);
}

export async function handleCreateAccount(request: Request, env: Env, userId: string): Promise<Response> {
  const rawBody = await request.json().catch(() => null);
  const parsed = CreateAccountSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  const id = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO accounts (id, user_id, currency, account_type) VALUES (?, ?, ?, ?)'
  ).bind(id, userId, body.currency.toUpperCase(), body.account_type ?? 'personal').run();

  const account = await env.DB.prepare('SELECT * FROM accounts WHERE id = ?').bind(id).first();
  return ok(account, 201);
}
