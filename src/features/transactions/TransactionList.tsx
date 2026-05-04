import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '@/src/theme';
import { brand } from '@/src/theme/colors';
import { EmptyState } from '@/src/components/EmptyState';
import { TransactionRow } from './TransactionRow';
import { TransactionSkeleton } from './TransactionSkeleton';
import { TransactionFilters } from './TransactionFilters';
import { TransactionDetails } from './TransactionDetails';
import { useTransactions } from './useTransactions';
import { useFilters } from './useFilters';
import { useDebounce } from '@/src/hooks/useDebounce';
import type { Transaction, SortOrder } from './types';

export function TransactionList() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const selectedRef = useRef<Transaction | null>(null);
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null);

  const {
    filters,
    setSearch,
    setAssetFilter,
    setTypeFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
  } = useFilters();

  // Debounce search to avoid firing on every keystroke
  const debouncedSearch = useDebounce(filters.search, 350);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  const {
    transactions,
    uniqueAssets,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isError,
    error,
  } = useTransactions(effectiveFilters);

  const handleRowPress = useCallback((t: Transaction) => {
    setSelectedTx(t);
    selectedRef.current = t;
    bottomSheetRef.current?.present();
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(filters.sortOrder === 'desc' ? 'asc' : 'desc' as SortOrder);
  }, [filters.sortOrder, setSortOrder]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionRow transaction={item} onPress={handleRowPress} />
    ),
    [handleRowPress],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={[styles.divider, { backgroundColor: colors.border }]} />,
    [colors.border],
  );

  const ListHeader = useCallback(
    () => (
      <TransactionFilters
        search={filters.search}
        assetFilter={filters.assetFilter}
        typeFilter={filters.typeFilter}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        availableAssets={uniqueAssets}
        onSearchChange={setSearch}
        onAssetChange={setAssetFilter}
        onTypeChange={setTypeFilter}
        onSortByChange={setSortBy}
        onSortOrderToggle={toggleSortOrder}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, uniqueAssets, hasActiveFilters],
  );

  const ListEmpty = useCallback(() => {
    if (isLoading) return null;
    if (isError) {
      return (
        <EmptyState
          icon="wifi-off"
          title="Something went wrong"
          subtitle={(error as Error)?.message ?? 'Failed to load transactions. Please try again.'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      );
    }
    return (
      <EmptyState
        icon="inbox"
        title="No transactions"
        subtitle={
          hasActiveFilters
            ? 'No transactions match the current filters.'
            : 'Your transactions will appear here.'
        }
        actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
        onAction={hasActiveFilters ? resetFilters : undefined}
      />
    );
  }, [isLoading, isError, error, hasActiveFilters, refetch, resetFilters]);

  const ListFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={brand.secondary} />
        </View>
      ) : null,
    [isFetchingNextPage],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ListHeader />
        <TransactionSkeleton count={8} />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={transactions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.25}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={refetch}
            tintColor={brand.secondary}
            colors={[brand.secondary]}
          />
        }
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={transactions.length === 0 ? styles.emptyContent : undefined}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews
      />

      <TransactionDetails bottomSheetRef={bottomSheetRef} transaction={selectedTx} />
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContent: {
    flexGrow: 1,
  },
});
