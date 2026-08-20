const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'cult_token';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to connect to server. Please try again.');
  }

  let json = null;
  try {
    json = await response.json();
  } catch {
    // ignore non-JSON responses
  }

  if (!response.ok) {
    const details = json?.error?.details;
    const message =
      Array.isArray(details) && details.length > 0
        ? details.map((d) => d.message).join(' ')
        : json?.error?.message || 'Something went wrong. Please try again.';
    throw new ApiError(message, response.status, details);
  }

  return json;
}