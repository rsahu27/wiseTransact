export interface KVNamespaces {
  SESSIONS: KVNamespace;
  FEATURE_FLAGS: KVNamespace;
  CACHE: KVNamespace;
}

export async function kvSet(
  ns: KVNamespace,
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const opts = ttlSeconds ? { expirationTtl: ttlSeconds } : undefined;
  await ns.put(key, JSON.stringify(value), opts);
}

export async function kvGet<T>(ns: KVNamespace, key: string): Promise<T | null> {
  const raw = await ns.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function kvDelete(ns: KVNamespace, key: string): Promise<void> {
  await ns.delete(key);
}

export function sessionKey(userId: string, sessionId: string): string {
  return `session:${userId}:${sessionId}`;
}

export function flagKey(flagName: string): string {
  return `flag:${flagName}`;
}

export function cacheKey(resource: string, params: string): string {
  return `cache:${resource}:${params}`;
}
