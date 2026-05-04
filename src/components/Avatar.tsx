import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand } from '@/src/theme/colors';

interface Props {
  initials?: string;
  size?: number;
}

export function Avatar({ initials = 'U', size = 32 }: Props) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: brand.secondary,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Lato_700Bold',
  },
});
