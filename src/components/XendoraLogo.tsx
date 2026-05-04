import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { brand } from '@/src/theme/colors';

/**
 * Replace the Text fallback with an <Image> once the PNG asset is saved at
 * assets/logo/xendora-logo-horizontal.png
 *
 * Example:
 *   import Logo from '@/assets/logo/xendora-logo-horizontal.png';
 *   <Image source={Logo} style={{ height, width: height * aspectRatio }} resizeMode="contain" />
 */
interface Props {
  height?: number;
  color?: string;
}

export function XendoraLogo({ height = 24, color }: Props) {
  return (
    <View style={[styles.container, { height }]}>
      <Text
        style={[
          styles.wordmark,
          { fontSize: height * 0.72, color: color ?? brand.secondary },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        XENDORA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: 'Lato_900Black',
    letterSpacing: 1.2,
  },
});
