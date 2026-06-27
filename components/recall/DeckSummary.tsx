import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface DeckSummaryProps {
  source: string;
  dueCount: number;
}

export function DeckSummary({ source, dueCount }: DeckSummaryProps) {
  let iconName = 'book';
  let colorClass = 'bg-blue-500';

  if (source === 'Language') {
    iconName = 'text.bubble';
    colorClass = 'bg-purple-500';
  } else if (source === 'Places') {
    iconName = 'map';
    colorClass = 'bg-orange-500';
  } else if (source === 'Culture') {
    iconName = 'theatermasks';
    colorClass = 'bg-pink-500';
  }

  return (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-center flex-1">
        <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${colorClass}`}>
          <SymbolView name={iconName as any} tintColor="white" size={24} />
        </View>
        <View>
          <Text className="text-lg font-heading text-gray-900">{source}</Text>
          <Text className="text-sm text-gray-500">
            {dueCount > 0 ? `${dueCount} cards due today` : 'All caught up'}
          </Text>
        </View>
      </View>
      
      {dueCount > 0 && (
        <View className="bg-primary/10 w-10 h-10 rounded-full items-center justify-center">
          <Text className="font-bold text-primary">{dueCount}</Text>
        </View>
      )}
    </View>
  );
}
