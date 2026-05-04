import { useCallback, useEffect, useRef, useState } from 'react';
import { getItem, setItem } from '@/src/utils/storage';
import type { TransactionFilters, TransactionType, SortField, SortOrder } from './types';

const STORAGE_KEY = '@xendora/transaction-filters';

interface PersistedFilters {
  assetFilter?: string;
  typeFilter?: TransactionType;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  assetFilter: undefined,
  typeFilter: undefined,
  sortBy: 'date',
  sortOrder: 'desc',
};

export function useFilters() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rehydrate persisted filters on mount (search is intentionally not persisted)
  useEffect(() => {
    getItem<PersistedFilters>(STORAGE_KEY).then((saved) => {
      if (!saved) return;
      setFilters((f) => ({
        ...f,
        assetFilter: saved.assetFilter,
        typeFilter: saved.typeFilter,
        sortBy: saved.sortBy ?? f.sortBy,
        sortOrder: saved.sortOrder ?? f.sortOrder,
      }));
    });
  }, []);

  // Debounced persistence on filter change (not search)
  const persistFilters = useCallback((next: TransactionFilters) => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      setItem<PersistedFilters>(STORAGE_KEY, {
        assetFilter: next.assetFilter,
        typeFilter: next.typeFilter,
        sortBy: next.sortBy,
        sortOrder: next.sortOrder,
      });
    }, 500);
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search }));
  }, []);

  const setAssetFilter = useCallback(
    (assetFilter: string | undefined) => {
      setFilters((f) => {
        const next = { ...f, assetFilter };
        persistFilters(next);
        return next;
      });
    },
    [persistFilters],
  );

  const setTypeFilter = useCallback(
    (typeFilter: TransactionType | undefined) => {
      setFilters((f) => {
        const next = { ...f, typeFilter };
        persistFilters(next);
        return next;
      });
    },
    [persistFilters],
  );

  const setSortBy = useCallback(
    (sortBy: SortField) => {
      setFilters((f) => {
        const next = { ...f, sortBy };
        persistFilters(next);
        return next;
      });
    },
    [persistFilters],
  );

  const setSortOrder = useCallback(
    (sortOrder: SortOrder) => {
      setFilters((f) => {
        const next = { ...f, sortOrder };
        persistFilters(next);
        return next;
      });
    },
    [persistFilters],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setItem<PersistedFilters>(STORAGE_KEY, {
      sortBy: DEFAULT_FILTERS.sortBy,
      sortOrder: DEFAULT_FILTERS.sortOrder,
    });
  }, []);

  const hasActiveFilters =
    !!filters.search || !!filters.assetFilter || !!filters.typeFilter;

  return {
    filters,
    setSearch,
    setAssetFilter,
    setTypeFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
  };
}
