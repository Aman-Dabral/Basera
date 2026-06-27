import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { Flashcard as FlashcardType } from '../../store/recall';
import { SymbolView } from 'expo-symbols';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const flipAnim = useSharedValue(0); // 0 for front, 1 for back

  useEffect(() => {
    flipAnim.value = withSpring(isFlipped ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [isFlipped, flipAnim]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` }
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` }
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={onFlip}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      className="items-center justify-center self-center"
    >
      {/* Front of Card */}
      <Animated.View 
        style={[frontAnimatedStyle, { width: '100%', height: '100%' }]}
        className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 items-center justify-center"
      >
        <Text className="text-sm font-semibold text-gray-400 mb-6 tracking-widest uppercase">Question</Text>
        <Text className="text-3xl font-heading text-gray-900 text-center leading-tight">
          {card.front}
        </Text>
        <View className="absolute bottom-6 flex-row items-center space-x-2">
           <SymbolView name="hand.tap" tintColor="#9CA3AF" size={16} />
           <Text className="text-gray-400 text-sm ml-1">Tap to flip</Text>
        </View>
      </Animated.View>

      {/* Back of Card */}
      <Animated.View 
        style={[backAnimatedStyle, { width: '100%', height: '100%' }]}
        className="bg-[#FAF3E8] rounded-3xl shadow-lg border border-primary/20 p-8 items-center justify-center"
      >
        <View className="absolute top-6 px-3 py-1 bg-white/60 rounded-full border border-gray-200">
           <Text className="text-xs font-medium text-gray-600">Saved from {card.source}</Text>
        </View>

        <Text className="text-sm font-semibold text-primary mb-6 tracking-widest uppercase">Answer</Text>
        <Text className="text-3xl font-heading text-gray-900 text-center leading-tight">
          {card.back}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
