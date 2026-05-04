import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';

function SkeletonBox({ width, height, style }: { width: number | string; height: number; style?: object }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 6, backgroundColor: colors.skeleton, opacity },
        style,
      ]}
    />
  );
}

function SkeletonRow() {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.left}>
        <SkeletonBox width={56} height={22} />
        <SkeletonBox width={140} height={15} />
        <SkeletonBox width={80} height={12} />
      </View>
      <View style={styles.right}>
        <SkeletonBox width={90} height={15} />
        <SkeletonBox width={60} height={18} style={{ borderRadius: 99 }} />
      </View>
    </View>
  );
}

interface Props {
  count?: number;
}

export function TransactionSkeleton({ count = 8 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          <SkeletonRow />
          {i < count - 1 && (
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 6,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});
