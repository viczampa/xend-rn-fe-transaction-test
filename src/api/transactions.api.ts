import { apiClient } from './client';
import type {
  Transaction,
  TransactionApiStatus,
  TransactionsResponse,
} from '@/src/features/transactions/types';

export interface FetchTransactionsParams {
  page: number;
  pageSize: number;
  /** When set, sent as `status` (server-side filter). */
  status?: TransactionApiStatus;
}

/** Paginated fetch; optional `status` is applied on the server. Search/asset/type/sort stay client-side. */
export async function fetchTransactions(
  params: FetchTransactionsParams,
): Promise<TransactionsResponse> {
  const { page, pageSize, status } = params;
  const { data } = await apiClient.get<TransactionsResponse>('/transactions', {
    params: {
      page,
      pageSize,
      ...(status ? { status } : {}),
    },
  });

  // Normalise: the API might return just an array or a wrapped object
  if (Array.isArray(data)) {
    return { data: data as unknown as Transaction[], meta: undefined };
  }
  return data;
}
