import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/src/api/queryKeys';
import { fetchTransactions } from '@/src/api/transactions.api';
import { filterTransactionsLocal } from './filterTransactions';
import type { Transaction, TransactionFilters } from './types';

const PAGE_SIZE = 12;

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
      const aVal = parseFloat(a.source.amount.value);
      const bVal = parseFloat(b.source.amount.value);
      diff = aVal - bVal;
    }
    return sortOrder === 'asc' ? diff : -diff;
  });
}

export function useTransactions(filters: TransactionFilters) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.transactions.list,
    queryFn: ({ pageParam }) =>
      fetchTransactions({ page: pageParam as number, pageSize: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = lastPage.data?.length ?? 0;
      if (fetched < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30_000,
    retry: 2,
  });

  const flatPages = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

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
      if (t.destination.amount.currency) currencies.add(t.destination.amount.currency.toUpperCase());
    });
    return Array.from(currencies).sort();
  }, [flatPages]);

  return {
    transactions,
    uniqueAssets,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    error: query.error,
    isError: query.isError,
  };
}
