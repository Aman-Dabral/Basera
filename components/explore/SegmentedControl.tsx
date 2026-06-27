import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onChange }: SegmentedControlProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Assuming equal widths for 2 items. Simplification for 2 options.
    translateX.value = withSpring(selectedIndex === 0 ? 0 : 100, {
      damping: 20,
      stiffness: 250,
    });
  }, [selectedIndex, translateX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: `${translateX.value}%` }],
    };
  });

  return (
    <View className="flex-row bg-gray-200 rounded-full p-1 mx-4 my-2 relative">
      <Animated.View
        className="absolute top-1 bottom-1 left-1 bg-white rounded-full w-[49.5%]"
        style={animatedIndicatorStyle}
      />
      {options.map((option, index) => (
        <TouchableWithoutFeedback key={option} onPress={() => onChange(index)}>
          <View className="flex-1 items-center justify-center py-2 z-10">
            <Text
              className={`font-semibold ${
                selectedIndex === index ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {option}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}
