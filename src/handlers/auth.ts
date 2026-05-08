import type { Env } from '../types/index.js';
import { ok, err } from '../utils/response.js';
import { signJwt, verifyJwt, hashPassword, verifyPassword } from '../middleware/auth.js';
import { kvSet, kvGet, kvDelete, sessionKey } from '../utils/kv.js';
import { RegisterSchema, LoginSchema, RefreshSchema, validationProblem } from '../utils/validation.js';

const ACCESS_TOKEN_TTL = 15 * 60;
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

function generateId(): string {
  return crypto.randomUUID();
}

export async function handleRegister(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first();
  if (existing) return err('Email already registered', 409);

  const id = generateId();
  const hashed = await hashPassword(body.password);
  await env.DB.prepare(
    'INSERT INTO users (id, email, phone, hashed_password, full_name) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, body.email, body.phone ?? null, hashed, body.full_name ?? null).run();

  const sessionId = generateId();
  const now = Math.floor(Date.now() / 1000);
  const accessToken = await signJwt({ sub: id, email: body.email, sessionId, iat: now, exp: now + ACCESS_TOKEN_TTL }, env.JWT_SECRET);
  const refreshToken = await signJwt({ sub: id, email: body.email, sessionId, iat: now, exp: now + REFRESH_TOKEN_TTL, type: 'refresh' }, env.JWT_SECRET);
  await kvSet(env.SESSIONS, sessionKey(id, sessionId), { userId: id, sessionId }, REFRESH_TOKEN_TTL);

  return ok({ accessToken, refreshToken, userId: id }, 201);
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  // Rate limit: max 5 login attempts per IP per 15 minutes
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const rateLimitKey = `ratelimit:login:${ip}`;
  const window = 15 * 60; // 15 minutes in seconds
  const maxAttempts = 5;

  const current = await kvGet<{ count: number; resetAt: number }>(env.SESSIONS, rateLimitKey);
  const now = Math.floor(Date.now() / 1000);

  if (current && current.resetAt > now) {
    if (current.count >= maxAttempts) {
      const retryAfter = current.resetAt - now;
      return new Response(
        JSON.stringify({ success: false, error: 'Too many login attempts. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(maxAttempts),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(current.resetAt),
          },
        }
      );
    }
    await kvSet(env.SESSIONS, rateLimitKey, { count: current.count + 1, resetAt: current.resetAt }, window);
  } else {
    await kvSet(env.SESSIONS, rateLimitKey, { count: 1, resetAt: now + window }, window);
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = LoginSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  const user = await env.DB.prepare('SELECT id, email, hashed_password FROM users WHERE email = ?').bind(body.email).first<{ id: string; email: string; hashed_password: string }>();
  if (!user) return err('Invalid credentials', 401);
  if (!(await verifyPassword(body.password, user.hashed_password))) return err('Invalid credentials', 401);

  const sessionId = generateId();
  const now2 = Math.floor(Date.now() / 1000);
  const accessToken = await signJwt({ sub: user.id, email: user.email, sessionId, iat: now2, exp: now2 + ACCESS_TOKEN_TTL }, env.JWT_SECRET);
  const refreshToken = await signJwt({ sub: user.id, email: user.email, sessionId, iat: now2, exp: now2 + REFRESH_TOKEN_TTL, type: 'refresh' }, env.JWT_SECRET);
  await kvSet(env.SESSIONS, sessionKey(user.id, sessionId), { userId: user.id, sessionId }, REFRESH_TOKEN_TTL);

  return ok({ accessToken, refreshToken });
}

export async function handleRefresh(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.json().catch(() => null);
  const parsed = RefreshSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  const payload = await verifyJwt(body.refreshToken, env.JWT_SECRET);
  if (!payload) return err('Invalid or expired refresh token', 401);

  const session = await kvGet(env.SESSIONS, sessionKey(payload.sub, payload.sessionId));
  if (!session) return err('Session expired or revoked', 401);

  const now = Math.floor(Date.now() / 1000);
  const accessToken = await signJwt({ sub: payload.sub, email: payload.email, sessionId: payload.sessionId, iat: now, exp: now + ACCESS_TOKEN_TTL }, env.JWT_SECRET);

  return ok({ accessToken });
}

export async function handleLogout(_request: Request, env: Env, userId: string, sessionId: string): Promise<Response> {
  await kvDelete(env.SESSIONS, sessionKey(userId, sessionId));
  return ok({ message: 'Logged out successfully' });
}
