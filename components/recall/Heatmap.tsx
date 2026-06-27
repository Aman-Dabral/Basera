import React from 'react';
import { View, Text } from 'react-native';

interface HeatmapProps {
  history: Record<string, number>;
}

export function Heatmap({ history }: HeatmapProps) {
  // Simple mock heatmap rendering past 4 weeks (28 days)
  const days = [];
  const today = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const count = history[dateStr] || 0;
    
    let colorClass = 'bg-gray-200';
    if (count > 0 && count <= 5) colorClass = 'bg-primary/30';
    else if (count > 5 && count <= 15) colorClass = 'bg-primary/60';
    else if (count > 15) colorClass = 'bg-primary';

    days.push(
      <View 
        key={dateStr} 
        className={`w-4 h-4 rounded-sm m-[2px] ${colorClass}`} 
      />
    );
  }

  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-base font-semibold text-gray-800 mb-3">Review Activity</Text>
      <View className="flex-row flex-wrap justify-start items-center">
        {days}
      </View>
      <View className="flex-row items-center mt-3 justify-end space-x-1">
        <Text className="text-xs text-gray-400 mr-1">Less</Text>
        <View className="w-3 h-3 rounded-sm m-[1px] bg-gray-200" />
        <View className="w-3 h-3 rounded-sm m-[1px] bg-primary/30" />
        <View className="w-3 h-3 rounded-sm m-[1px] bg-primary/60" />
        <View className="w-3 h-3 rounded-sm m-[1px] bg-primary" />
        <Text className="text-xs text-gray-400 ml-1">More</Text>
      </View>
    </View>
  );
}
