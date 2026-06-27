import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRecallStore, Flashcard } from '../../../store/recall';
import { Heatmap } from '../../../components/recall/Heatmap';
import { DeckSummary } from '../../../components/recall/DeckSummary';
import { SymbolView } from 'expo-symbols';

export default function RecallIndexScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cards, history, getDueCards } = useRecallStore();
  
  const dueCards = getDueCards();

  // Group due cards by source
  const dueBySource = useMemo(() => {
    const groups: Record<string, number> = { Language: 0, Places: 0, Culture: 0 };
    dueCards.forEach(card => {
      groups[card.source] = (groups[card.source] || 0) + 1;
    });
    return groups;
  }, [dueCards]);

  const totalDue = dueCards.length;
  const isFinished = totalDue === 0 && cards.length > 0;
  const isEmpty = cards.length === 0;

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#FAF3E8' }}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 100 }}
    >
      <Text className="text-3xl font-heading text-gray-900 mb-6">Recall</Text>

      <Heatmap history={history} />

      <View className="mt-8">
        <Text className="text-xl font-heading text-gray-900 mb-4">Your Decks</Text>

        {isEmpty ? (
          <View className="items-center justify-center mt-10">
            <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center mb-4">
               <SymbolView name="sparkles.rectangle.stack" tintColor="#9CA3AF" size={48} />
            </View>
            <Text className="text-lg font-semibold text-gray-800 text-center">No cards yet!</Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-4">
              Save places in Explore or complete lessons in Learn to build your deck.
            </Text>
          </View>
        ) : isFinished ? (
          <View className="items-center justify-center mt-10 p-6 bg-white rounded-3xl border border-green-100 shadow-sm">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
               <SymbolView name="checkmark.seal.fill" tintColor="#10B981" size={32} />
            </View>
            <Text className="text-xl font-heading text-gray-900 text-center">All caught up!</Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Nice work clearing your daily reviews. See you tomorrow!
            </Text>
          </View>
        ) : (
          <>
            {Object.entries(dueBySource).map(([source, count]) => (
              <DeckSummary key={source} source={source} dueCount={count} />
            ))}

            <TouchableOpacity
              className="mt-6 bg-primary rounded-2xl py-4 items-center shadow-md flex-row justify-center"
              onPress={() => router.push('/(tabs)/recall/review')}
            >
              <Text className="text-white font-semibold text-lg mr-2">Review All ({totalDue})</Text>
              <SymbolView name="play.fill" tintColor="white" size={16} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
