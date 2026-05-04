import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { login as apiLogin } from '@/src/api/auth.api';
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from '@/src/api/authTokenStorage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContext extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    getAuthToken()
      .then((token) => {
        setState({ token, isAuthenticated: !!token, isLoading: false });
      })
      .catch(() => {
        setState({ token: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await apiLogin({ email, password });
    await setAuthToken(token);
    setState({ token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await removeAuthToken();
    setState({ token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <Ctx.Provider value={{ ...state, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuthContext(): AuthContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
