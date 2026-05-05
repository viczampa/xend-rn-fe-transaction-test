import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  xendoraLogoHorizontalXmlDarkUi,
  xendoraLogoHorizontalXmlLightUi,
} from '@/src/assets/xendoraLogoHorizontalXml';
import { useTheme } from '@/src/theme';

/** Matches `viewBox="0 0 2000 573.12"` in the SVG */
const VIEWBOX_RATIO = 2000 / 573.12;

interface Props {
  height?: number;
  /** Kept for API compatibility; fills come from theme-specific SVG variants */
  color?: string;
}

export function XendoraLogo({ height = 24 }: Props) {
  const { isDark } = useTheme();
  const xml = isDark ? xendoraLogoHorizontalXmlDarkUi : xendoraLogoHorizontalXmlLightUi;
  const width = height * VIEWBOX_RATIO;

  return (
    <View
      style={[styles.container, { height, width }]}
      accessibilityRole="image"
      accessibilityLabel="Xendora"
    >
      <SvgXml key={isDark ? 'dark-ui' : 'light-ui'} xml={xml} width={width} height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
