import type { Env } from './types/index.js';
import { authMiddleware } from './middleware/auth.js';
import { handleRegister, handleLogin, handleRefresh, handleLogout } from './handlers/auth.js';
import { handleGetProfile, handleUpdateProfile } from './handlers/user.js';
import { handleListAccounts, handleGetAccount, handleCreateAccount } from './handlers/accounts.js';
import { handleListTransactions, handleGetTransaction, handleCreateTransaction, handleGetFxRate } from './handlers/transactions.js';
import { err } from './utils/response.js';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        },
      });
    }

    // Public routes
    if (path === '/api/auth/register' && method === 'POST') return handleRegister(request, env);
    if (path === '/api/auth/login' && method === 'POST') return handleLogin(request, env);
    if (path === '/api/auth/refresh' && method === 'POST') return handleRefresh(request, env);
    if (path === '/api/transactions/fx-rate' && method === 'GET') return handleGetFxRate(request, env);

    // Protected routes — require JWT
    const authResult = await authMiddleware(request, env);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    if (path === '/api/auth/logout' && method === 'POST') return handleLogout(request, env, user.sub, user.sessionId);

    // User routes
    if (path === '/api/user/profile' && method === 'GET') return handleGetProfile(env, user.sub);
    if (path === '/api/user/profile' && method === 'PUT') return handleUpdateProfile(request, env, user.sub);

    // Account routes
    if (path === '/api/accounts' && method === 'GET') return handleListAccounts(env, user.sub);
    if (path === '/api/accounts' && method === 'POST') return handleCreateAccount(request, env, user.sub);
    const accountMatch = path.match(/^\/api\/accounts\/([^/]+)$/);
    if (accountMatch && method === 'GET') return handleGetAccount(env, user.sub, accountMatch[1]);

    // Transaction routes
    if (path === '/api/transactions' && method === 'GET') return handleListTransactions(request, env, user.sub);
    if (path === '/api/transactions' && method === 'POST') return handleCreateTransaction(request, env, user.sub);
    const txnMatch = path.match(/^\/api\/transactions\/([^/]+)$/);
    if (txnMatch && method === 'GET') return handleGetTransaction(env, user.sub, txnMatch[1]);

    return err('Not found', 404);
  },
};
