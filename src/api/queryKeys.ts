import type { TransactionFilters } from '@/src/features/transactions/types';

export const queryKeys = {
  auth: {
    token: ['auth', 'token'] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filters: TransactionFilters) =>
      ['transactions', 'list', filters] as const,
  },
} as const;
