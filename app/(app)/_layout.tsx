import React from 'react';
import { View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/features/auth/useAuth';
import { Header } from '@/src/components/Header';
import { useTheme } from '@/src/theme';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
