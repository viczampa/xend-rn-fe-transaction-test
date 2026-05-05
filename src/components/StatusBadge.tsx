import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import type { TransactionApiStatus } from '@/src/features/transactions/types';

interface Props {
  status: TransactionApiStatus;
  small?: boolean;
}

function labelForStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function StatusBadge({ status, small = false }: Props) {
  const { colors } = useTheme();

  const styleMap: Partial<Record<TransactionApiStatus, { bg: string; text: string }>> = {
    COMPLETED: { bg: colors.successSurface, text: colors.success },
    PENDING: { bg: colors.pendingSurface, text: colors.pending },
    PROCESSING: { bg: colors.pendingSurface, text: colors.pending },
    SUBMITTED: { bg: colors.pendingSurface, text: colors.pending },
    AWAITING_FUNDS: { bg: colors.pendingSurface, text: colors.pending },
    IN_REVIEW: { bg: colors.pendingSurface, text: colors.pending },
    PENDING_APPROVAL: { bg: colors.pendingSurface, text: colors.pending },
    FUNDS_RECEIVED: { bg: colors.pendingSurface, text: colors.pending },
    CREATED: { bg: colors.pendingSurface, text: colors.pending },
    FAILED: { bg: colors.errorSurface, text: colors.error },
    COMPLIANCE_REJECTED: { bg: colors.errorSurface, text: colors.error },
    RETURNED: { bg: colors.warningSurface, text: colors.warning },
    REFUNDED: { bg: colors.warningSurface, text: colors.warning },
    CANCELED: { bg: colors.pendingSurface, text: colors.textSubtle },
  };

  const fallback = { bg: colors.surface, text: colors.textSubtle };
  const { bg, text } = styleMap[status as TransactionApiStatus] ?? fallback;
  const fontSize = small ? 10 : 11;

  return (
    <View style={[styles.badge, { backgroundColor: bg, paddingHorizontal: small ? 6 : 8 }]}>
      <Text style={[styles.label, { color: text, fontSize }]}>
        {labelForStatus(status)}
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
