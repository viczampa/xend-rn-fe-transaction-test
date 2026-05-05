import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { queryKeys } from '@/src/api/queryKeys';
import { fetchTransactions } from '@/src/api/transactions.api';
import {
  getTransactionsNextPageParam,
  TRANSACTIONS_PAGE_SIZE,
} from '@/src/api/transactionsInfinite';
import type { TransactionsResponse } from '@/src/features/transactions/types';
import { filterTransactionsLocal } from './filterTransactions';
import type { Transaction, TransactionFilters } from './types';

/** Normalize merged pages: newest `date` first (API order may vary). */
function sortNewestDateFirst(list: Transaction[]): Transaction[] {
  return [...list].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
}

function sortTransactions(
  list: Transaction[],
  sortBy: 'date' | 'amount',
  sortOrder: 'asc' | 'desc',
): Transaction[] {
  return [...list].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'date') {
      diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      const aVal = parseFloat(a.source.amount.value ?? '');
      const bVal = parseFloat(b.source.amount.value ?? '');
      diff = aVal - bVal;
    }
    if (diff !== 0) return sortOrder === 'asc' ? diff : -diff;
    return a.id.localeCompare(b.id);
  });
}

/** True while another `/transactions` page should still be fetched (full dataset hydration). */
function needsMorePages(data: InfiniteData<TransactionsResponse> | undefined): boolean {
  if (!data?.pages.length) return true;
  const last = data.pages[data.pages.length - 1];
  return getTransactionsNextPageParam(last, data.pages) !== undefined;
}

export function useTransactions(filters: TransactionFilters) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.transactions.list;

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchTransactions({
        page: pageParam as number,
        pageSize: TRANSACTIONS_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      getTransactionsNextPageParam(lastPage, allPages),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  const { fetchNextPage } = query;

  useEffect(() => {
    if (!query.isSuccess || query.isError) return;

    let cancelled = false;

    void (async () => {
      while (!cancelled) {
        const d = queryClient.getQueryData<InfiniteData<TransactionsResponse>>(queryKey);
        if (!d?.pages.length) break;
        const last = d.pages[d.pages.length - 1];
        if (getTransactionsNextPageParam(last, d.pages) === undefined) break;

        try {
          await fetchNextPage();
        } catch {
          break;
        }

        await new Promise<void>((r) => setTimeout(r, 0));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query.isSuccess, query.isError, queryClient, fetchNextPage, queryKey]);

  const flatPages = useMemo(() => {
    const raw = query.data?.pages.flatMap((p) => p.data) ?? [];
    return sortNewestDateFirst(raw);
  }, [query.data]);

  const transactions = useMemo(() => {
    const filtered = filterTransactionsLocal(flatPages, filters);
    return sortTransactions(filtered, filters.sortBy, filters.sortOrder);
  }, [
    flatPages,
    filters.search,
    filters.assetFilter,
    filters.typeFilter,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const uniqueAssets = useMemo(() => {
    const currencies = new Set<string>();
    flatPages.forEach((t) => {
      if (t.source.amount.currency) currencies.add(t.source.amount.currency.toUpperCase());
      if (t.destination.amount.currency)
        currencies.add(t.destination.amount.currency.toUpperCase());
    });
    return Array.from(currencies).sort();
  }, [flatPages]);

  const isLoading =
    query.isPending || (query.isSuccess && needsMorePages(query.data));

  return {
    transactions,
    uniqueAssets,
    isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    error: query.error,
    isError: query.isError,
  };
}
