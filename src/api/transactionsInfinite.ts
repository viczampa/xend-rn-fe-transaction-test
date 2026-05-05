import type { TransactionsResponse } from '@/src/features/transactions/types';

/** Matches API limit (1–100); single requests pull more rows per round-trip. */
export const TRANSACTIONS_PAGE_SIZE = 100;

export function getTransactionsNextPageParam(
  lastPage: TransactionsResponse,
  allPages: TransactionsResponse[],
): number | undefined {
  const fetched = lastPage.data?.length ?? 0;
  if (fetched < TRANSACTIONS_PAGE_SIZE) return undefined;
  return allPages.length + 1;
}
