import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'serenity_spa_session';

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const persist = (nextSession) => {
    setSession(nextSession);
    saveSession(nextSession);
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persist(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persist(data);
    return data;
  };

  const refreshMe = async () => {
    if (!session?.token) {
      return null;
    }
    const data = await authApi.me(session.token);
    const nextSession = { ...session, ...data, token: session.token };
    persist(nextSession);
    return nextSession;
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({
      session,
      token: session?.token || null,
      user: session ? { name: session.name, email: session.email, role: session.role } : null,
      role: session?.role || null,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      refreshMe,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
