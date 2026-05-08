export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  FEATURE_FLAGS: KVNamespace;
  CACHE: KVNamespace;
  JWT_SECRET: string;
  FX_API_KEY: string;
  APP_ENV: string;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  currency: string;
  balance: number;
  account_type: 'personal' | 'business';
  status: 'active' | 'suspended' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  sender_account_id: string;
  receiver_account_id: string;
  amount: number;
  currency: string;
  fx_rate: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface AuthPayload {
  sub: string;
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
}
