import { apiFetch } from './api';

export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function register({ name, phone, email, password }) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { name, phone, email, password },
  });
}

export function googleLogin(idToken) {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: { idToken },
  });
}