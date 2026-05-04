export const queryKeys = {
  auth: {
    token: ['auth', 'token'] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    /** List cache is independent of UI filters — we always paginate the full API slice. */
    list: ['transactions', 'list'] as const,
  },
} as const;
