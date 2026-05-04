import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/features/auth/useAuth';
import { useTheme } from '@/src/theme';
import { brand } from '@/src/theme/colors';
import { XendoraLogo } from '@/src/components/XendoraLogo';

export default function LoginScreen() {
  const { colors, spacing, radius } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_TEST_USER_EMAIL ?? '');
  const [password, setPassword] = useState(process.env.EXPO_PUBLIC_TEST_USER_PASSWORD ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(app)');
    } catch (e) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <XendoraLogo height={36} />
          <Text style={[styles.tagline, { color: colors.textSubtle }]}>
            Transactions
          </Text>
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>
          <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
            Use your Xendora test credentials
          </Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSubtle }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                  borderRadius: radius.md,
                },
              ]}
              placeholder="email@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              returnKeyType="next"
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSubtle }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                  borderRadius: radius.md,
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!loading}
            />
          </View>

          {/* Error */}
          {error && (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          )}

          {/* Button */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: brand.secondary,
                opacity: pressed || loading ? 0.75 : 1,
                borderRadius: radius.md,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonLabel}>Sign in</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 60,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 4,
  },
  tagline: {
    fontSize: 13,
    fontFamily: 'Lato_400Regular',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  card: {
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Lato_900Black',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
    marginTop: -8,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Lato_700Bold',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Lato_400Regular',
  },
  error: {
    fontSize: 13,
    fontFamily: 'Lato_400Regular',
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
  },
});
