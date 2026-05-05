import { lightColors, darkColors, type ThemeColors } from './colors';
import { useThemePreference } from './ThemePreferenceProvider';

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type Theme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  isDark: boolean;
  /** Persisted light/dark choice for menus / settings. */
  setAppearance: (mode: 'light' | 'dark') => void;
};

export function useTheme(): Theme {
  const { isDark, setAppearance } = useThemePreference();
  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    isDark,
    setAppearance,
  };
}
