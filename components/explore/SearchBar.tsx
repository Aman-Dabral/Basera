import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="flex-row items-center px-4 py-2 bg-transparent z-10 w-full">
      <View className="flex-1 flex-row items-center bg-white rounded-xl px-3 h-12 shadow-sm border border-gray-100">
        <SymbolView name="magnifyingglass" tintColor="#9CA3AF" size={20} />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-800"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} className="p-1">
            <SymbolView name="xmark.circle.fill" tintColor="#9CA3AF" size={20} />
          </TouchableOpacity>
        )}
      </View>
      {isFocused && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            // Optional: dismiss keyboard here if using ref
          }}
          className="ml-3"
        >
          <Text className="text-primary font-medium text-base">Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
