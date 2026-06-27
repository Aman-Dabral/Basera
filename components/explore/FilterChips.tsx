import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { PlaceCategory } from '../../constants/MockExploreData';

interface FilterChipsProps {
  categories: PlaceCategory[];
  activeFilters: PlaceCategory[];
  onToggleFilter: (category: PlaceCategory) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function FilterChips({ categories, activeFilters, onToggleFilter }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-h-14 mt-2 px-4"
      contentContainerStyle={{ alignItems: 'center', gap: 10, paddingRight: 32 }}
    >
      {categories.map((category) => {
        const isActive = activeFilters.includes(category);
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onToggleFilter(category)}
            className={`px-4 py-2 rounded-full border ${
              isActive ? 'bg-primary border-primary' : 'bg-white border-gray-300'
            }`}
          >
            <Text
              className={`font-medium ${
                isActive ? 'text-white' : 'text-gray-700'
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
