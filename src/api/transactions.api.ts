import { apiClient } from './client';
import type { Transaction, TransactionsResponse, TransactionFilters } from '@/src/features/transactions/types';

export interface FetchTransactionsParams extends TransactionFilters {
  page: number;
  pageSize: number;
}

export async function fetchTransactions(
  params: FetchTransactionsParams,
): Promise<TransactionsResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    pageSize: params.pageSize,
  };

  if (params.search) query.search = params.search;
  if (params.typeFilter) query.type = params.typeFilter;
  if (params.assetFilter) query.currency = params.assetFilter;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;

  const { data } = await apiClient.get<TransactionsResponse>('/transactions', {
    params: query,
  });

  // Normalise: the API might return just an array or a wrapped object
  if (Array.isArray(data)) {
    return { data: data as unknown as Transaction[], meta: undefined };
  }
  return data;
}
