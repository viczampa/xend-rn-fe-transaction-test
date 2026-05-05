export const queryKeys = {
  auth: {
    token: ['auth', 'token'] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    /** Infinite list cache; `status` changes the wire query so it must be part of the key. */
    list: (status?: string | null) => ['transactions', 'list', status ?? 'all'] as const,
  },
} as const;
