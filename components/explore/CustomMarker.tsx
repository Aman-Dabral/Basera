import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { Place } from '../../constants/MockExploreData';

interface CustomMarkerProps {
  place: Place;
  isSelected: boolean;
  onPress: () => void;
}

export function CustomMarker({ place, isSelected, onPress }: CustomMarkerProps) {
  const scale = useSharedValue(isSelected ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.3 : 1, {
      damping: 10,
      stiffness: 100,
    });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Determine colors and icon based on category
  let bgColor = 'bg-primary';
  let iconName = 'mappin';
  
  if (place.category === 'Food') {
    bgColor = 'bg-orange-500';
    iconName = 'fork.knife';
  } else if (place.category === 'Places to visit') {
    bgColor = 'bg-blue-500';
    iconName = 'building.columns.fill';
  } else if (place.category === 'Areas/Galis') {
    bgColor = 'bg-green-600';
    iconName = 'map.fill';
  } else if (place.category === 'Hidden gems') {
    bgColor = 'bg-purple-500';
    iconName = 'sparkles';
  }

  return (
    <Marker
      coordinate={place.coordinate}
      onPress={onPress}
      tracksViewChanges={false} // Performance optimization
    >
      <Animated.View style={animatedStyle}>
        <View className={`w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-md ${bgColor}`}>
          <SymbolView name={iconName as any} tintColor="white" size={18} />
        </View>
        <View className="w-0 h-0 self-center border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white -mt-1 shadow-sm opacity-90" />
      </Animated.View>
    </Marker>
  );
}
