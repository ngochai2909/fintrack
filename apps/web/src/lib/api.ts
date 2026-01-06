const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || 'Something went wrong',
    );
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: credentials }),

  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => apiRequest('/auth/register', { method: 'POST', body: data }),

  logout: (token: string) =>
    apiRequest('/auth/logout', { method: 'POST', token }),

  refresh: (refreshToken: string) =>
    apiRequest('/auth/refresh', { method: 'POST', token: refreshToken }),
};

