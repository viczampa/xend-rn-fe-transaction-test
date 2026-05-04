import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { brand } from '@/src/theme/colors';
import { useTheme } from '@/src/theme';
import type { TransactionType } from '@/src/features/transactions/types';

const CONFIG: Record<
  TransactionType,
  { icon: React.ComponentProps<typeof Feather>['name']; label: string; color: string }
> = {
  WITHDRAWAL: { icon: 'arrow-up-right', label: 'Send', color: '#EF4444' },
  DEPOSIT: { icon: 'arrow-down-left', label: 'Receive', color: '#10B981' },
  EXCHANGE: { icon: 'repeat', label: 'Swap', color: brand.secondary },
};

interface Props {
  type: TransactionType;
}

export function TypeBadge({ type }: Props) {
  const { colors } = useTheme();
  const { icon, label, color } = CONFIG[type] ?? CONFIG.DEPOSIT;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Feather name={icon} size={14} color={color} />
      <Text style={[styles.label, { color: colors.textSubtle }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Lato_700Bold',
  },
});
