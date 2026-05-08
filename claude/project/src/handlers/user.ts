import type { Env } from '../types/index.js';
import { ok, err } from '../utils/response.js';
import { UpdateProfileSchema, validationProblem } from '../utils/validation.js';

export async function handleGetProfile(env: Env, userId: string): Promise<Response> {
  const user = await env.DB.prepare(
    'SELECT id, email, phone, full_name, kyc_status, created_at FROM users WHERE id = ?'
  ).bind(userId).first();
  if (!user) return err('User not found', 404);
  return ok(user);
}

export async function handleUpdateProfile(request: Request, env: Env, userId: string): Promise<Response> {
  const rawBody = await request.json().catch(() => null);
  const parsed = UpdateProfileSchema.safeParse(rawBody);
  if (!parsed.success) return validationProblem(parsed.error);
  const body = parsed.data;

  await env.DB.prepare(
    'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(body.full_name ?? null, body.phone ?? null, userId).run();

  return ok({ message: 'Profile updated' });
}

