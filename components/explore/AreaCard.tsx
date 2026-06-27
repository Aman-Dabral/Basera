import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Area } from '../../constants/MockExploreData';

interface AreaCardProps {
  area: Area;
  onPress: (area: Area) => void;
}

export function AreaCard({ area, onPress }: AreaCardProps) {
  // Simulating image load - normally use area.photoUrl if available
  const placeholderImage = require('../../assets/images/react-logo.png'); // Fallback to expo logo or an asset

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(area)}
      className="mx-4 my-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <View className="h-32 bg-gray-200">
        {/* Replace source with actual photo when available */}
        <Image
          source={placeholderImage}
          className="w-full h-full opacity-50"
          resizeMode="cover"
        />
        <View className="absolute bottom-2 left-3 bg-white/90 px-2 py-1 rounded-md">
          <Text className="text-xs font-semibold text-primary">{area.tier}</Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-xl font-heading text-gray-900 mb-1">{area.name}</Text>
        <Text className="text-sm font-medium text-gray-500 mb-2">{area.vibe}</Text>
        
        <View className="mt-2 bg-background p-3 rounded-xl">
          <Text className="text-sm text-gray-700 leading-5">
            <Text className="font-semibold text-gray-900">Known for: </Text>
            {area.knownFor}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
