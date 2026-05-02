'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { api } from './api';

interface User { _id: string; name: string; email: string; role: string; }
interface AuthCtx { user: User | null; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; loading: boolean; }

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (cookie will be sent automatically)
    api.get<{ user: User }>('/api/auth/me')
      .then(r => setUser(r.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<{ user: User }>('/api/auth/login', { email, password });
    // Server sets httpOnly cookie automatically, just update local user state
    flushSync(() => {
      setUser(r.user);
      setLoading(false);
    });
  };

  const logout = async () => {
    await api.post('/api/auth/logout', {}).catch(() => {});
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
