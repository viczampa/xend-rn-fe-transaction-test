import React, { useCallback, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  View,
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
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
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
  }, []);

  const handleSheetDismiss = useCallback(() => {
    setSelectedTx(null);
  }, []);

  useLayoutEffect(() => {
    if (selectedTx === null) return;
    bottomSheetRef.current?.present();
  }, [selectedTx]);

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

  /** Outside FlatList: ListHeader identity changes removed the mounted TextInput and dismissed the keyboard on each keystroke. */
  const filtersHeader = (
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
      <View style={[styles.outer, { backgroundColor: colors.background }]}>
        {filtersHeader}
        <TransactionSkeleton count={8} />
      </View>
    );
  }

  return (
    <>
      <View style={[styles.outer, { backgroundColor: colors.background }]}>
        {filtersHeader}
        <FlatList
          data={transactions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          ItemSeparatorComponent={ItemSeparator}
          keyboardShouldPersistTaps="always"
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
          style={styles.flatList}
          contentContainerStyle={transactions.length === 0 ? styles.emptyContent : undefined}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
          removeClippedSubviews
        />
      </View>

      <TransactionDetails
        bottomSheetRef={bottomSheetRef}
        transaction={selectedTx}
        onDismiss={handleSheetDismiss}
      />
    </>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    overflow: 'visible',
    zIndex: 0,
  },
  flatList: {
    flex: 1,
  },
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
