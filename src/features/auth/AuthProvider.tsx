import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin } from '@/src/api/auth.api';
import { TOKEN_KEY } from '@/src/api/client';

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
    SecureStore.getItemAsync(TOKEN_KEY).then((token) => {
      setState({ token, isAuthenticated: !!token, isLoading: false });
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await apiLogin({ email, password });
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setState({ token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
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
