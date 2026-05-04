import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme';
import { XendoraLogo } from './XendoraLogo';
import { Avatar } from './Avatar';
import { useAuth } from '@/src/features/auth/useAuth';

const HEADER_HEIGHT = 56;

interface Props {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({ onMenuPress, onProfilePress }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { logout } = useAuth();

  const handleProfilePress = onProfilePress ?? logout;

  return (
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
        {/* Left: hamburger + logo */}
        <View style={styles.left}>
          <Pressable
            onPress={onMenuPress}
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <Feather name="menu" size={22} color={colors.text} />
          </Pressable>
          <XendoraLogo height={22} />
        </View>

        {/* Right: profile icon */}
        <Pressable
          onPress={handleProfilePress}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          accessibilityLabel="Profile / Logout"
          accessibilityRole="button"
        >
          <Avatar size={32} initials="G" />
        </Pressable>
      </View>
    </View>
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
});
