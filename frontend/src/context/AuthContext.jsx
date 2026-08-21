import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { setToken } from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'cult_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setTokenState] = useState(() => localStorage.getItem('cult_token'));
  const [loading, setLoading] = useState(false);

  const persistAuth = (newToken, newUser) => {
    setToken(newToken);
    setTokenState(newToken);
    storeUser(newUser);
    setUser(newUser);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      persistAuth(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, phone, email, password }) => {
    setLoading(true);
    try {
      const { data } = await authService.register({ name, phone, email, password });
      persistAuth(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (idToken) => {
    setLoading(true);
    try {
      const { data } = await authService.googleLogin(idToken);
      persistAuth(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    persistAuth(null, null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      googleLogin,
      logout,
    }),
    [user, token, loading, login, register, googleLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}