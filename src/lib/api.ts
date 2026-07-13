import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Calls the Express resource server with the current Better Auth JWT
 * attached as a Bearer token. Express never sees a session cookie — this
 * is the only thing that authenticates a client request to it.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiError(401, 'Not signed in');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      Authorization: `Bearer ${data.token}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message ?? `Request failed with status ${res.status}`,
    );
  }

  // Handle empty responses (e.g. 204 No Content) gracefully.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
