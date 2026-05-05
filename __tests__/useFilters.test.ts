import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { useFilters } from '../src/features/transactions/useFilters';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('useFilters', () => {
  beforeEach(async () => {
    await act(async () => {
      await AsyncStorage.clear();
    });
  });

  it('starts with default filters', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.assetFilter).toBeUndefined();
    expect(result.current.filters.typeFilter).toBeUndefined();
    expect(result.current.filters.statusFilter).toBeUndefined();
    expect(result.current.filters.sortBy).toBe('date');
    expect(result.current.filters.sortOrder).toBe('desc');
  });

  it('updates search', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setSearch('Guilherme'));
    expect(result.current.filters.search).toBe('Guilherme');
  });

  it('updates asset filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setAssetFilter('USDC'));
    expect(result.current.filters.assetFilter).toBe('USDC');
  });

  it('updates status filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setStatusFilter('COMPLETED'));
    expect(result.current.filters.statusFilter).toBe('COMPLETED');
  });

  it('reports hasActiveFilters when status filter is set', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setStatusFilter('PENDING'));
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('updates type filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setTypeFilter('WITHDRAWAL'));
    expect(result.current.filters.typeFilter).toBe('WITHDRAWAL');
  });

  it('reports hasActiveFilters when search is set', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.hasActiveFilters).toBe(false);
    act(() => result.current.setSearch('test'));
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('reports hasActiveFilters when type filter is set', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setTypeFilter('DEPOSIT'));
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('resets all filters', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setSearch('test');
      result.current.setAssetFilter('EUR');
      result.current.setTypeFilter('WITHDRAWAL');
      result.current.setStatusFilter('COMPLETED');
    });
    act(() => result.current.resetFilters());
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.assetFilter).toBeUndefined();
    expect(result.current.filters.typeFilter).toBeUndefined();
    expect(result.current.filters.statusFilter).toBeUndefined();
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('toggles sort order via setSortOrder', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setSortOrder('asc'));
    expect(result.current.filters.sortOrder).toBe('asc');
    act(() => result.current.setSortOrder('desc'));
    expect(result.current.filters.sortOrder).toBe('desc');
  });

  it('changes sortBy', () => {
    const { result } = renderHook(() => useFilters());
    act(() => result.current.setSortBy('amount'));
    expect(result.current.filters.sortBy).toBe('amount');
  });
});
