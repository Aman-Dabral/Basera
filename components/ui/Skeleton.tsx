import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1, // Infinite
      true // Reverse
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E5E7EB', '#F3F4F6'] // Tailwind gray-200 to gray-100
    );
    return { backgroundColor };
  });

  return (
    <Animated.View 
      style={[
        { width, height, borderRadius },
        animatedStyle,
        style
      ]} 
    />
  );
}
