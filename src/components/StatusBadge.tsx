import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import { capitalise } from '@/src/utils/format';
import type { TransactionStatus } from '@/src/features/transactions/types';

interface Props {
  status: TransactionStatus;
  small?: boolean;
}

export function StatusBadge({ status, small = false }: Props) {
  const { colors } = useTheme();

  const config: Record<TransactionStatus, { bg: string; text: string }> = {
    COMPLETED: { bg: colors.successSurface, text: colors.success },
    PENDING: { bg: colors.pendingSurface, text: colors.pending },
    PROCESSING: { bg: colors.pendingSurface, text: colors.pending },
    FAILED: { bg: colors.errorSurface, text: colors.error },
    RETURNED: { bg: colors.warningSurface, text: colors.warning },
  };

  const { bg, text } = config[status] ?? config.PENDING;
  const fontSize = small ? 10 : 11;

  return (
    <View style={[styles.badge, { backgroundColor: bg, paddingHorizontal: small ? 6 : 8 }]}>
      <Text style={[styles.label, { color: text, fontSize }]}>
        {capitalise(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Lato_700Bold',
  },
});
