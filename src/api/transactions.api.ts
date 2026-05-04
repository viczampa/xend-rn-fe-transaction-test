import { apiClient } from './client';
import type { Transaction, TransactionsResponse } from '@/src/features/transactions/types';

export interface FetchTransactionsParams {
  page: number;
  pageSize: number;
}

/** Paginated fetch only — filters/sort are applied in `useTransactions` (API rejects extra params). */
export async function fetchTransactions(
  params: FetchTransactionsParams,
): Promise<TransactionsResponse> {
  const { data } = await apiClient.get<TransactionsResponse>('/transactions', {
    params: { page: params.page, pageSize: params.pageSize },
  });

  // Normalise: the API might return just an array or a wrapped object
  if (Array.isArray(data)) {
    return { data: data as unknown as Transaction[], meta: undefined };
  }
  return data;
}
