import React, { forwardRef, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Place } from '../../constants/MockExploreData';
import { useRecallStore } from '../../store/recall';

interface PlaceBottomSheetProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceBottomSheet = forwardRef<BottomSheet, PlaceBottomSheetProps>(
  ({ place, onClose }, ref) => {
    const snapPoints = useMemo(() => ['45%'], []);
    const router = useRouter();
    const { addCard } = useRecallStore();

    const handleAskBuddy = () => {
      if (place) {
        router.push({
          pathname: '/(tabs)/buddy',
          params: { context: `About ${place.name}: ${place.significance}` }
        });
      }
    };

    const handleSaveToFlashcards = () => {
      if (place) {
        addCard(
          place.name, 
          `${place.significance}${place.cuisine ? `\nCuisine: ${place.cuisine}` : ''}`, 
          'Places'
        );
        Alert.alert("Saved!", `Added ${place.name} to your Recall deck.`);
      }
    };

    if (!place) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
        backgroundStyle={{ backgroundColor: '#FAF3E8', borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#D1C8BA', width: 40 }}
      >
        <View className="flex-1 px-5 pt-2">
          {/* Header Row */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-heading text-gray-900 mb-1">{place.name}</Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-primary/10 px-2 py-1 rounded-md mr-2">
                  <Text className="text-xs font-semibold text-primary">{place.category}</Text>
                </View>
              </View>
            </View>
            {place.photoUrl ? (
              <Image source={{ uri: place.photoUrl }} className="w-16 h-16 rounded-xl" />
            ) : (
              <View className="w-16 h-16 rounded-xl bg-gray-200 items-center justify-center">
                <SymbolView name="photo" tintColor="#9CA3AF" size={24} />
              </View>
            )}
          </View>

          {/* Significance Note */}
          <Text className="text-base text-gray-700 leading-6 mb-4">
            {place.significance}
          </Text>

          {/* Food Details (if applicable) */}
          {place.category === 'Food' && (
            <View className="bg-white p-3 rounded-xl mb-4 border border-gray-100 shadow-sm">
              {place.cuisine && (
                <Text className="text-sm text-gray-600 mb-1">
                  <Text className="font-semibold text-gray-800">Cuisine: </Text>{place.cuisine}
                </Text>
              )}
              {place.priceRange && (
                <Text className="text-sm text-gray-600 mb-1">
                  <Text className="font-semibold text-gray-800">Price: </Text>{place.priceRange}
                </Text>
              )}
              {place.localReputation && (
                <Text className="text-sm text-gray-600">
                  <Text className="font-semibold text-gray-800">Vibe: </Text>{place.localReputation}
                </Text>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row items-center mt-auto mb-6 gap-3">
            <TouchableOpacity 
              className="flex-1 bg-primary rounded-xl py-3.5 items-center shadow-sm"
              onPress={handleAskBuddy}
            >
              <Text className="text-white font-semibold text-base">Ask Buddy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSaveToFlashcards}
              className="bg-white rounded-xl py-3.5 px-6 items-center shadow-sm border border-gray-200"
            >
              <SymbolView name="bookmark" tintColor="#E2703A" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }
);
