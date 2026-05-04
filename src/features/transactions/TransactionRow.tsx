import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TypeBadge } from '@/src/components/TypeBadge';
import { formatAmount, formatRelativeDate } from '@/src/utils/format';
import type { Transaction } from './types';

interface Props {
  transaction: Transaction;
  onPress: (t: Transaction) => void;
}

function getCounterparty(t: Transaction): string {
  if (t.type === 'WITHDRAWAL') return t.destination.name || 'Unknown';
  if (t.type === 'DEPOSIT') return t.source.name || 'Unknown';
  return `${t.source.amount.currency.toUpperCase()} → ${t.destination.amount.currency.toUpperCase()}`;
}

export const TransactionRow = memo(function TransactionRow({ transaction: t, onPress }: Props) {
  const { colors, spacing } = useTheme();

  const counterparty = getCounterparty(t);
  const srcAmount = formatAmount(t.source.amount.value, t.source.amount.currency);
  const dstAmount = formatAmount(t.destination.amount.value, t.destination.amount.currency);
  const isConversion = t.source.amount.currency !== t.destination.amount.currency;

  return (
    <Pressable
      onPress={() => onPress(t)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.surface : colors.background,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${t.type} transaction, ${counterparty}, ${srcAmount}`}
    >
      {/* Left: type + counterparty + date */}
      <View style={styles.left}>
        <TypeBadge type={t.type} />
        <Text
          style={[styles.counterparty, { color: colors.text }]}
          numberOfLines={1}
        >
          {counterparty}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {formatRelativeDate(t.date)}
        </Text>
      </View>

      {/* Right: amount + status */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.text }]} numberOfLines={1}>
          {srcAmount}
        </Text>
        {isConversion && (
          <Text style={[styles.converted, { color: colors.textSubtle }]} numberOfLines={1}>
            → {dstAmount}
          </Text>
        )}
        <StatusBadge status={t.status} small />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  counterparty: {
    fontSize: 15,
    fontFamily: 'Lato_700Bold',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Lato_400Regular',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
    maxWidth: 140,
  },
  amount: {
    fontSize: 15,
    fontFamily: 'Lato_700Bold',
    textAlign: 'right',
  },
  converted: {
    fontSize: 12,
    fontFamily: 'Lato_400Regular',
    textAlign: 'right',
  },
});
