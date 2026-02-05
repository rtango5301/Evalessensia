/**
 * API Client
 * Core API client with Supabase JWT token injection for authenticated requests
 */

import { createClient } from '@/lib/supabase/client';
import { getApiUrl } from './config';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 400;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Gets the current user's JWT access token from Supabase
 * @returns The access token or null if not authenticated
 */
async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/**
 * Builds headers for API requests, including JWT authentication
 */
async function buildHeaders(includeAuth: boolean = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handles API response and throws ApiError for non-ok responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `API Error: ${response.status} ${response.statusText}`;
    let code: string | undefined;

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
      code = errorData.code;
    } catch {
      // Response body is not JSON, use default message
    }

    throw new ApiError(message, response.status, code);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Makes a GET request to the API
 * @param path - API endpoint path
 * @param requireAuth - Whether to include JWT token (default: true)
 */
export async function apiGet<T>(path: string, requireAuth: boolean = true): Promise<T> {
  const headers = await buildHeaders(requireAuth);
  const response = await fetch(getApiUrl(path), {
    method: 'GET',
    headers,
  });
  return handleResponse<T>(response);
}

/**
 * Makes a POST request to the API
 * @param path - API endpoint path
 * @param body - Request body
 * @param requireAuth - Whether to include JWT token (default: true)
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  requireAuth: boolean = true
): Promise<T> {
  const headers = await buildHeaders(requireAuth);
  const response = await fetch(getApiUrl(path), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

/**
 * Makes a DELETE request to the API
 * @param path - API endpoint path
 * @param requireAuth - Whether to include JWT token (default: true)
 */
export async function apiDelete<T>(path: string, requireAuth: boolean = true): Promise<T> {
  const headers = await buildHeaders(requireAuth);
  const response = await fetch(getApiUrl(path), {
    method: 'DELETE',
    headers,
  });
  return handleResponse<T>(response);
}
