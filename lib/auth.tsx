'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { api } from './api';

interface User { _id: string; name: string; email: string; role: string; }
interface AuthCtx { user: User | null; token: string | null; login: (email: string, password: string) => Promise<void>; logout: () => void; loading: boolean; }

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('sora_token');
    if (t) {
      setToken(t);
      api.get<{ user: User }>('/api/auth/me')
        .then(r => setUser(r.user))
        .catch(() => { localStorage.removeItem('sora_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
    localStorage.setItem('sora_token', r.token);
    // flushSync forces React to commit these state updates synchronously
    // before the caller can call router.push(), preventing the redirect loop
    flushSync(() => {
      setToken(r.token);
      setUser(r.user);
      setLoading(false);
    });
  };

  const logout = () => {
    localStorage.removeItem('sora_token');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
