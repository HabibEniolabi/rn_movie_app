import React from 'react';
import { View, ViewStyle } from 'react-native';

interface DividerProps {
  height?: number;
  color?: string;
  marginVertical?: number;
  marginHorizontal?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  height = 1,
  color = '#e0e0e0',
  marginVertical = 16,
  marginHorizontal = 0,
  style
}) => {
  return (
    <View
      style={[
        {
          height,
          backgroundColor: color,
          marginVertical,
          marginHorizontal
        },
        style
      ]}
    />
  );
};