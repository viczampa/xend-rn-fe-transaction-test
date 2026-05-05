import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  type TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme';
import { brand } from '@/src/theme/colors';
import type { TransactionType, SortField, SortOrder } from './types';

const TYPE_OPTIONS: { label: string; value: TransactionType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Send', value: 'WITHDRAWAL' },
  { label: 'Receive', value: 'DEPOSIT' },
  { label: 'Swap', value: 'EXCHANGE' },
];

interface Props {
  search: string;
  assetFilter: string | undefined;
  typeFilter: TransactionType | undefined;
  sortBy: SortField;
  sortOrder: SortOrder;
  availableAssets: string[];
  onSearchChange: (v: string) => void;
  onAssetChange: (v: string | undefined) => void;
  onTypeChange: (v: TransactionType | undefined) => void;
  onSortByChange: (v: SortField) => void;
  onSortOrderToggle: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? brand.secondary : colors.surface,
          borderColor: active ? brand.secondary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          { color: active ? '#FFFFFF' : colors.textSubtle },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function TransactionFilters({
  search,
  assetFilter,
  typeFilter,
  sortBy,
  sortOrder,
  availableAssets,
  onSearchChange,
  onAssetChange,
  onTypeChange,
  onSortByChange,
  onSortOrderToggle,
  onReset,
  hasActiveFilters,
}: Props) {
  const { colors, spacing } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleAssetPress = useCallback(
    (asset: string | undefined) => {
      onAssetChange(assetFilter === asset ? undefined : asset);
    },
    [assetFilter, onAssetChange],
  );

  const sortIcon: React.ComponentProps<typeof Feather>['name'] =
    sortOrder === 'asc' ? 'arrow-up' : 'arrow-down';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: colors.surface,
            borderColor: searchFocused ? colors.textSubtle : colors.border,
            marginHorizontal: spacing.md,
          },
        ]}
      >
        <Feather name="search" size={16} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search by name or bank"
          accessibilityLabel="Search transactions"
          accessibilityHint="Filters by names, sender or receiver, and bank name"
          placeholderTextColor={colors.textMuted}
          underlineColorAndroid="transparent"
          style={[styles.searchInput, { color: colors.text }, searchInputWebUnsetOutline]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <Pressable onPress={() => onSearchChange('')} hitSlop={8}>
            <Feather name="x" size={14} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Type filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipRow, { paddingHorizontal: spacing.md }]}
      >
        {TYPE_OPTIONS.map((opt) => (
          <Chip
            key={opt.label}
            label={opt.label}
            active={typeFilter === opt.value}
            onPress={() => onTypeChange(opt.value)}
          />
        ))}

        <View style={[styles.dividerV, { backgroundColor: colors.border }]} />

        {/* Asset filter chips */}
        {availableAssets.map((asset) => (
          <Chip
            key={asset}
            label={asset}
            active={assetFilter === asset}
            onPress={() => handleAssetPress(asset)}
          />
        ))}
      </ScrollView>

      {/* Sort controls + reset */}
      <View style={[styles.sortRow, { paddingHorizontal: spacing.md }]}>
        <Pressable
          onPress={() => onSortByChange(sortBy === 'date' ? 'amount' : 'date')}
          style={[styles.sortBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Feather name="sliders" size={13} color={colors.textSubtle} />
          <Text style={[styles.sortLabel, { color: colors.textSubtle }]}>
            {sortBy === 'date' ? 'Date' : 'Amount'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onSortOrderToggle}
          style={[styles.sortBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Feather name={sortIcon} size={13} color={colors.textSubtle} />
          <Text style={[styles.sortLabel, { color: colors.textSubtle }]}>
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </Text>
        </Pressable>

        {hasActiveFilters && (
          <Pressable onPress={onReset} style={styles.resetBtn}>
            <Text style={[styles.resetLabel, { color: brand.secondary }]}>Reset</Text>
          </Pressable>
        )}
      </View>

      {/* Bottom border */}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
    </View>
  );
}

/** Chromium `:focus-visible` default ring on `<input>` (RN Web maps TextInput → input). */
const searchInputWebUnsetOutline =
  Platform.OS === 'web'
    ? ({
        outlineWidth: 0,
        outlineStyle: 'none',
        boxShadow: 'none',
      } as unknown as TextStyle)
    : undefined;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
    padding: 0,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: 'Lato_700Bold',
  },
  dividerV: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortLabel: {
    fontSize: 12,
    fontFamily: 'Lato_400Regular',
  },
  resetBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 4,
  },
  resetLabel: {
    fontSize: 13,
    fontFamily: 'Lato_700Bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
