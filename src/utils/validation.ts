import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'password must be at least 8 characters'),
  phone: z.string().optional(),
  full_name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const CreateAccountSchema = z.object({
  currency: z.string().length(3, 'currency must be a 3-letter ISO code'),
  account_type: z.enum(['personal', 'business']).default('personal'),
});

export const CreateTransactionSchema = z.object({
  sender_account_id: z.string().uuid(),
  receiver_account_id: z.string().uuid(),
  amount: z.number().positive('amount must be greater than 0'),
  currency: z.string().length(3),
});

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
});

// RFC 7807 Problem Details response
export function problemDetail(
  type: string,
  title: string,
  status: number,
  detail: string,
  extra?: Record<string, unknown>
): Response {
  return new Response(
    JSON.stringify({ type, title, status, detail, ...extra }),
    {
      status,
      headers: { 'Content-Type': 'application/problem+json' },
    }
  );
}

export function validationProblem(errors: z.ZodError): Response {
  return problemDetail(
    'https://wisetransact.io/errors/validation',
    'Validation Error',
    422,
    'One or more fields failed validation.',
    { errors: errors.flatten().fieldErrors }
  );
}
