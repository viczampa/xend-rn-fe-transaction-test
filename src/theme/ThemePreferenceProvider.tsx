import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { getItem, setItem } from '@/src/utils/storage';

const STORAGE_KEY = '@xendora/theme-appearance';

export type AppearancePreference = 'light' | 'dark' | null;

type ThemePreferenceContextValue = {
  isDark: boolean;
  /** `null` means follow system appearance until the user picks light/dark. */
  preference: AppearancePreference;
  setAppearance: (mode: 'light' | 'dark') => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(
  null,
);

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<AppearancePreference>(null);

  useEffect(() => {
    getItem<'light' | 'dark'>(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setPreference(saved);
    });
  }, []);

  const isDark =
    preference === null ? systemScheme === 'dark' : preference === 'dark';

  const setAppearance = useCallback((mode: 'light' | 'dark') => {
    setPreference(mode);
    void setItem(STORAGE_KEY, mode);
  }, []);

  const value = useMemo(
    () => ({ isDark, preference, setAppearance }),
    [isDark, preference, setAppearance],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

/** Appearance override + setter; safe outside provider (falls back to system only). */
export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  const systemScheme = useColorScheme();

  return useMemo(() => {
    if (ctx) return ctx;
    const systemDark = systemScheme === 'dark';
    return {
      isDark: systemDark,
      preference: null,
      setAppearance: () => {},
    };
  }, [ctx, systemScheme]);
}
