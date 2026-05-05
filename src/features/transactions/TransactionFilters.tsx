import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  type TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme';
import { brand } from '@/src/theme/colors';
import type {
  TransactionType,
  TransactionApiStatus,
  SortField,
  SortOrder,
} from './types';

/** Status / type labels aligned with challenge copy (Withdrawal, Deposit, Exchange). */
const TYPE_OPTIONS: { label: string; value: TransactionType | undefined }[] = [
  { label: 'All types', value: undefined },
  { label: 'Withdrawal', value: 'WITHDRAWAL' },
  { label: 'Deposit', value: 'DEPOSIT' },
  { label: 'Exchange', value: 'EXCHANGE' },
];

const API_STATUS_VALUES: TransactionApiStatus[] = [
  'CREATED',
  'PENDING',
  'AWAITING_FUNDS',
  'IN_REVIEW',
  'FUNDS_RECEIVED',
  'PENDING_APPROVAL',
  'SUBMITTED',
  'PROCESSING',
  'COMPLETED',
  'RETURNED',
  'REFUNDED',
  'FAILED',
  'COMPLIANCE_REJECTED',
  'UNDELIVERABLE',
  'MISSING_RETURN_POLICY',
  'CANCELED',
];

function titleCaseStatusEnum(value: string): string {
  return value
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

const STATUS_OPTIONS: { label: string; value: TransactionApiStatus | undefined }[] = [
  { label: 'All statuses', value: undefined },
  ...API_STATUS_VALUES.map((value) => ({ label: titleCaseStatusEnum(value), value })),
];

type Expanded = 'asset' | 'type' | 'status' | null;

interface Props {
  search: string;
  assetFilter: string | undefined;
  typeFilter: TransactionType | undefined;
  statusFilter: TransactionApiStatus | undefined;
  sortBy: SortField;
  sortOrder: SortOrder;
  availableAssets: string[];
  onSearchChange: (v: string) => void;
  onAssetChange: (v: string | undefined) => void;
  onTypeChange: (v: TransactionType | undefined) => void;
  onStatusChange: (v: TransactionApiStatus | undefined) => void;
  onSortByChange: (v: SortField) => void;
  onSortOrderToggle: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

function DropdownOption({
  label,
  selected,
  onSelect,
  showDividerBelow,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  showDividerBelow?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.dropdownOption,
        showDividerBelow && { borderBottomColor: colors.border },
        !showDividerBelow && styles.dropdownOptionLast,
        {
          backgroundColor:
            selected ? `${brand.secondary}18` : pressed ? `${colors.border}66` : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.dropdownOptionLabel,
          { color: selected ? colors.text : colors.textSubtle },
        ]}
      >
        {label}
      </Text>
      {selected && <Feather name="check" size={18} color={brand.secondary} />}
    </Pressable>
  );
}

function FilterDropdown({
  expanded,
  dropdownId,
  onToggle,
  triggerLabel,
  valueLabel,
  children,
}: {
  expanded: Expanded;
  dropdownId: Exclude<Expanded, null>;
  onToggle: () => void;
  triggerLabel: string;
  valueLabel: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const open = expanded === dropdownId;
  const a11yValue = `${triggerLabel}: ${valueLabel}${open ? ', menu expanded' : ', menu collapsed'}`;
  return (
    <View style={[styles.dropdownBlock, open && styles.dropdownBlockOpen]}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.dropdownTrigger,
          {
            borderColor: open ? colors.textSubtle : colors.border,
            backgroundColor: colors.surface,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={a11yValue}
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.dropdownTriggerTexts}>
          <Text style={[styles.dropdownMeta, { color: colors.textMuted }]}>{triggerLabel}</Text>
          <Text style={[styles.dropdownValue, { color: colors.text }]} numberOfLines={1}>
            {valueLabel}
          </Text>
        </View>
        <Feather
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSubtle}
        />
      </Pressable>
      {open && (
        <View style={[styles.dropdownPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {children}
        </View>
      )}
    </View>
  );
}

export function TransactionFilters({
  search,
  assetFilter,
  typeFilter,
  statusFilter,
  sortBy,
  sortOrder,
  availableAssets,
  onSearchChange,
  onAssetChange,
  onTypeChange,
  onStatusChange,
  onSortByChange,
  onSortOrderToggle,
  onReset,
  hasActiveFilters,
}: Props) {
  const { colors, spacing } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [expanded, setExpanded] = useState<Expanded>(null);

  const toggleExpanded = useCallback((id: Exclude<Expanded, null>) => {
    setExpanded((e) => (e === id ? null : id));
  }, []);

  const assetSummary = assetFilter ?? 'All assets';
  const typeSummary =
    TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label ?? TYPE_OPTIONS[0].label;
  const statusSummary =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? STATUS_OPTIONS[0].label;

  const overlayMenuOpen = expanded !== null;

  const sortIcon: React.ComponentProps<typeof Feather>['name'] =
    sortOrder === 'asc' ? 'arrow-up' : 'arrow-down';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        overlayMenuOpen && styles.containerFloating,
      ]}
    >
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

      {/* Filter dropdowns */}
      <View style={[styles.dropdownsRow, { paddingHorizontal: spacing.md, gap: 10 }]}>
        <FilterDropdown
          expanded={expanded}
          dropdownId="asset"
          onToggle={() => toggleExpanded('asset')}
          triggerLabel="Asset"
          valueLabel={assetSummary}
        >
          <ScrollView
            nestedScrollEnabled
            style={styles.dropdownScroll}
            keyboardShouldPersistTaps="handled"
          >
            <DropdownOption
              label="All assets"
              selected={!assetFilter}
              showDividerBelow={availableAssets.length > 0}
              onSelect={() => {
                onAssetChange(undefined);
                setExpanded(null);
              }}
            />
            {availableAssets.map((asset, i) => (
              <DropdownOption
                key={asset}
                label={asset}
                selected={assetFilter === asset}
                showDividerBelow={i < availableAssets.length - 1}
                onSelect={() => {
                  onAssetChange(asset);
                  setExpanded(null);
                }}
              />
            ))}
          </ScrollView>
        </FilterDropdown>

        <FilterDropdown
          expanded={expanded}
          dropdownId="type"
          onToggle={() => toggleExpanded('type')}
          triggerLabel="Type"
          valueLabel={typeSummary}
        >
          <ScrollView
            nestedScrollEnabled
            style={styles.dropdownScroll}
            keyboardShouldPersistTaps="handled"
          >
            {TYPE_OPTIONS.map((opt, i) => (
              <DropdownOption
                key={`${opt.label}-${opt.value ?? 'all'}`}
                label={opt.label}
                selected={typeFilter === opt.value}
                showDividerBelow={i < TYPE_OPTIONS.length - 1}
                onSelect={() => {
                  onTypeChange(opt.value);
                  setExpanded(null);
                }}
              />
            ))}
          </ScrollView>
        </FilterDropdown>

        <FilterDropdown
          expanded={expanded}
          dropdownId="status"
          onToggle={() => toggleExpanded('status')}
          triggerLabel="Status"
          valueLabel={statusSummary}
        >
          <ScrollView
            nestedScrollEnabled
            style={styles.dropdownScroll}
            keyboardShouldPersistTaps="handled"
          >
            {STATUS_OPTIONS.map((opt, i) => (
              <DropdownOption
                key={`${opt.label}-${opt.value ?? 'all'}`}
                label={opt.label}
                selected={statusFilter === opt.value}
                showDividerBelow={i < STATUS_OPTIONS.length - 1}
                onSelect={() => {
                  onStatusChange(opt.value);
                  setExpanded(null);
                }}
              />
            ))}
          </ScrollView>
        </FilterDropdown>
      </View>

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
    overflow: 'visible',
    position: 'relative',
  },
  /**
   * In `TransactionList`, `FlatList` is rendered *after* this block in the DOM / view tree,
   * so without a stacking boost the list paints over overlapping menus. Elevate while open only.
   */
  containerFloating: {
    zIndex: 999,
    elevation: 999,
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
  dropdownsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 2,
    overflow: 'visible',
    zIndex: 1,
  },
  /** Anchor for `position:absolute` dropdown panel (`top:100%`). */
  dropdownBlock: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    zIndex: 1,
  },
  /** Open dropdown’s block stacks above sibling (Asset vs Type). */
  dropdownBlockOpen: {
    zIndex: 30,
    elevation: 30,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  dropdownTriggerTexts: {
    flex: 1,
    minWidth: 0,
  },
  dropdownMeta: {
    fontSize: 11,
    fontFamily: 'Lato_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  dropdownValue: {
    fontSize: 14,
    fontFamily: 'Lato_700Bold',
  },
  dropdownPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: 220,
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 14,
      },
      web: {
        boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.28)',
      },
    }),
  },
  dropdownScroll: {
    maxHeight: 220,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
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
