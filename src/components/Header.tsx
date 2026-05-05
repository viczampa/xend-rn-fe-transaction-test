import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Text,
  Platform,
  Switch,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/theme';
import { XendoraLogo } from './XendoraLogo';
import { Avatar } from './Avatar';
import { useAuth } from '@/src/features/auth/useAuth';

const HEADER_HEIGHT = 56;
const DRAWER_WIDTH = 300;
const SLIDE_DURATION_MS = 260;
/** Max opacity when menu is fully open — matches former static rgba(0,0,0,0.45). */
const BACKDROP_MAX_OPACITY = 0.45;

interface Props {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({ onMenuPress, onProfilePress }: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, isDark, setAppearance } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  /** Slide drawer left (<-) then unmount Modal. */
  const closeDrawerAnimated = useCallback(
    (): Promise<void> =>
      new Promise((resolve) => {
        Animated.parallel([
          Animated.timing(drawerTranslateX, {
            toValue: -DRAWER_WIDTH,
            duration: SLIDE_DURATION_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: SLIDE_DURATION_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (finished) setDrawerVisible(false);
          resolve();
        });
      }),
    [backdropOpacity, drawerTranslateX],
  );

  /** Slide drawer right (->) onto screen. */
  const openDrawerAnimated = useCallback(() => {
    drawerTranslateX.setValue(-DRAWER_WIDTH);
    backdropOpacity.setValue(0);
    setDrawerVisible(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: 0,
          duration: SLIDE_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
            toValue: BACKDROP_MAX_OPACITY,
            duration: SLIDE_DURATION_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
      ]).start();
    });
  }, [backdropOpacity, drawerTranslateX]);

  /** Android hardware back button: slide drawer closed. */
  useEffect(() => {
    if (!drawerVisible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      void closeDrawerAnimated();
      return true;
    });
    return () => sub.remove();
  }, [drawerVisible, closeDrawerAnimated]);

  const handleMenuPress = useCallback(() => {
    if (onMenuPress) {
      onMenuPress();
      return;
    }
    openDrawerAnimated();
  }, [onMenuPress, openDrawerAnimated]);

  const handleAvatarPress = useCallback(() => {
    if (onProfilePress) {
      onProfilePress();
      return;
    }
    openDrawerAnimated();
  }, [onProfilePress, openDrawerAnimated]);

  const goTransactions = useCallback(() => {
    void closeDrawerAnimated();
    router.replace('/(app)');
  }, [closeDrawerAnimated, router]);

  const handleLogout = useCallback(async () => {
    await closeDrawerAnimated();
    await logout();
    router.replace('/(auth)/login');
  }, [closeDrawerAnimated, logout, router]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            height: HEADER_HEIGHT + insets.top,
            backgroundColor: colors.surfaceElevated,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.inner}>
          <View style={styles.left}>
            <Pressable
              onPress={handleMenuPress}
              hitSlop={8}
              style={({ pressed }) => [styles.hit44, { opacity: pressed ? 0.6 : 1 }]}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <Feather name="menu" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={goTransactions}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              accessibilityLabel="Transactions home"
              accessibilityRole="link"
            >
              <XendoraLogo height={22} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleAvatarPress}
            hitSlop={8}
            style={({ pressed }) => [styles.hit44, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <Avatar size={32} initials="G" />
          </Pressable>
        </View>
      </View>

      <Modal
        visible={drawerVisible}
        animationType="none"
        transparent
        statusBarTranslucent
        onRequestClose={() => void closeDrawerAnimated()}
      >
        <View style={styles.modalRoot} accessibilityViewIsModal>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => void closeDrawerAnimated()}
              accessibilityLabel="Close menu"
              accessibilityRole="button"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.drawer,
              {
                width: DRAWER_WIDTH,
                paddingTop: insets.top + spacing.md,
                paddingBottom: insets.bottom + spacing.md,
                backgroundColor: colors.surfaceElevated,
                borderRightColor: colors.border,
                transform: [{ translateX: drawerTranslateX }],
              },
            ]}
          >
            <View style={styles.drawerInner}>
              <View style={styles.drawerTopGroup}>
                <Pressable
                  onPress={goTransactions}
                  style={({ pressed }) => [
                    styles.menuRow,
                    { backgroundColor: pressed ? colors.surface : 'transparent' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Transactions"
                >
                  <Feather name="list" size={22} color={colors.text} />
                  <Text style={[styles.menuLabel, { color: colors.text }]}>Transactions</Text>
                </Pressable>

                <View style={[styles.menuRow, styles.themeToggleRow]}>
                  <Feather name={isDark ? 'moon' : 'sun'} size={22} color={colors.text} />
                  <Text style={[styles.menuLabel, styles.themeLabel, { color: colors.text }]}>
                    Dark mode
                  </Text>
                  <Switch
                    accessibilityLabel="Toggle dark mode"
                    value={isDark}
                    onValueChange={(enabled) => setAppearance(enabled ? 'dark' : 'light')}
                    trackColor={{
                      false: colors.border,
                      true: colors.secondary,
                    }}
                    thumbColor={Platform.OS === 'android' ? '#f4f4f5' : undefined}
                    ios_backgroundColor={colors.border}
                  />
                </View>
              </View>

              <View style={styles.drawerFooterSpacer} />

              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [
                  styles.menuRow,
                  { backgroundColor: pressed ? colors.surface : 'transparent' },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Log out"
              >
                <Feather name="log-out" size={22} color={colors.error} />
                <Text style={[styles.menuLabel, { color: colors.error }]}>Logout</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    zIndex: 10,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hit44: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  drawerInner: {
    flex: 1,
  },
  drawerTopGroup: {
    gap: 4,
  },
  drawerFooterSpacer: {
    flex: 1,
  },
  themeToggleRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  themeLabel: {
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: 'Lato_700Bold',
  },
});
