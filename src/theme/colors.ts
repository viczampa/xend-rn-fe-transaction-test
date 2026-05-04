export const brand = {
  primary: 'rgb(62, 65, 70)',
  secondary: 'rgb(122, 93, 233)',
} as const;

export const lightColors = {
  ...brand,
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceElevated: '#FFFFFF',
  border: 'rgba(62, 65, 70, 0.08)',
  text: 'rgb(62, 65, 70)',
  textSubtle: 'rgba(62, 65, 70, 0.55)',
  textMuted: 'rgba(62, 65, 70, 0.35)',
  success: '#10B981',
  successSurface: '#ECFDF5',
  error: '#EF4444',
  errorSurface: '#FEF2F2',
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',
  pending: '#6B7280',
  pendingSurface: '#F3F4F6',
  skeleton: 'rgba(62, 65, 70, 0.08)',
  skeletonHighlight: 'rgba(62, 65, 70, 0.16)',
} as const;

export const darkColors: typeof lightColors = {
  ...brand,
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  border: 'rgba(255, 255, 255, 0.08)',
  text: '#F9FAFB',
  textSubtle: 'rgba(249, 250, 251, 0.55)',
  textMuted: 'rgba(249, 250, 251, 0.35)',
  success: '#10B981',
  successSurface: '#022C22',
  error: '#F87171',
  errorSurface: '#2D0A0A',
  warning: '#FBBF24',
  warningSurface: '#292100',
  pending: '#9CA3AF',
  pendingSurface: '#1F2937',
  skeleton: 'rgba(255, 255, 255, 0.06)',
  skeletonHighlight: 'rgba(255, 255, 255, 0.12)',
};

export type ThemeColors = typeof lightColors;
