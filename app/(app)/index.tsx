import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import { TransactionList } from '@/src/features/transactions/TransactionList';

export default function TransactionsScreen() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.heading, { paddingHorizontal: spacing.md, paddingTop: spacing.md }]}>
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
      </View>
      <TransactionList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    paddingBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Lato_900Black',
  },
});
