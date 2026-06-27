import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRecallStore, Rating } from '../../../store/recall';
import { Flashcard } from '../../../components/recall/Flashcard';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getDueCards, reviewCard } = useRecallStore();

  const [queue, setQueue] = useState(() => getDueCards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = queue[currentIndex];

  const handleRating = (rating: Rating) => {
    if (currentCard) {
      reviewCard(currentCard.id, rating);
    }
    
    // Move to next card
    if (currentIndex < queue.length - 1) {
      setIsFlipped(false);
      // Wait for flip back before showing next card
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    } else {
      // Done with review queue
      router.back();
    }
  };

  if (!currentCard) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF3E8', paddingTop: insets.top }} className="items-center justify-center">
        <Text className="text-lg text-gray-500">No cards to review!</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-2 rounded-full">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = ((currentIndex) / queue.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF3E8', paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <SymbolView name="xmark" tintColor="#6B7280" size={24} />
        </TouchableOpacity>
        <View className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </View>
        <Text className="text-sm font-semibold text-gray-500">
          {currentIndex + 1} / {queue.length}
        </Text>
      </View>

      {/* Card Area */}
      <View className="flex-1 justify-center px-4">
        <Flashcard 
          key={currentCard.id} // Ensure unmount/mount if needed, but array mapping is fine
          card={currentCard} 
          isFlipped={isFlipped} 
          onFlip={() => setIsFlipped(true)} 
        />
      </View>

      {/* Action Buttons */}
      <View className="pb-10 pt-4 px-6 min-h-[140px] justify-center">
        {isFlipped ? (
          <>
            <Text className="text-center text-sm font-medium text-gray-500 mb-4">How hard was it to recall?</Text>
            <View className="flex-row justify-between space-x-2">
              <TouchableOpacity 
                onPress={() => handleRating('Again')}
                className="flex-1 items-center justify-center bg-red-100 py-3 rounded-xl border border-red-200"
              >
                <Text className="text-red-700 font-semibold">Again</Text>
                <Text className="text-red-500 text-xs mt-0.5">&lt; 1m</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleRating('Hard')}
                className="flex-1 items-center justify-center bg-orange-100 py-3 rounded-xl border border-orange-200"
              >
                <Text className="text-orange-700 font-semibold">Hard</Text>
                <Text className="text-orange-500 text-xs mt-0.5">2d</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleRating('Good')}
                className="flex-1 items-center justify-center bg-blue-100 py-3 rounded-xl border border-blue-200"
              >
                <Text className="text-blue-700 font-semibold">Good</Text>
                <Text className="text-blue-500 text-xs mt-0.5">4d</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleRating('Easy')}
                className="flex-1 items-center justify-center bg-green-100 py-3 rounded-xl border border-green-200"
              >
                <Text className="text-green-700 font-semibold">Easy</Text>
                <Text className="text-green-500 text-xs mt-0.5">6d</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="items-center">
            <TouchableOpacity 
              onPress={() => setIsFlipped(true)}
              className="w-full bg-gray-200 py-4 rounded-2xl items-center"
            >
              <Text className="text-gray-700 font-semibold text-lg">Show Answer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
