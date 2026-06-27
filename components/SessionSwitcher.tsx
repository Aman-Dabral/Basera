import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSessionStore } from '@/store/useSessionStore';

export default function SessionSwitcher() {
  const router = useRouter();
  const { sessions, activeSessionId, setActiveSession, deleteSession } = useSessionStore();

  const handleLongPress = (id: string) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this travel session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteSession(id) }
      ]
    );
  };

  return (
    <View className="mb-6 pt-2 h-36">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <Animated.View 
              key={session.id} 
              layout={LinearTransition.springify()} 
              entering={FadeInRight} 
              exiting={FadeOutLeft}
            >
              <TouchableOpacity
                onPress={() => setActiveSession(session.id)}
                onLongPress={() => handleLongPress(session.id)}
                className={`p-4 rounded-2xl border w-48 h-full ${isActive ? 'bg-black border-black' : 'bg-white border-gray-200 shadow-sm'}`}
              >
                <View className="flex-row items-center mb-1">
                  <Ionicons name="location" size={16} color={isActive ? "white" : "gray"} />
                  <Text className={`font-semibold ml-1 text-sm ${isActive ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>
                    {session.cityFrom}
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="arrow-down" size={16} color="transparent" />
                  <Text className={`font-semibold ml-1 text-sm ${isActive ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>
                    To {session.cityTo}
                  </Text>
                </View>
                
                <View className="flex-row items-center justify-between mt-auto">
                  <View>
                    <Text className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>Last active</Text>
                    <Text className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {new Date(session.lastActiveAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {/* Mock progress ring */}
                  <View className={`w-8 h-8 rounded-full border-2 items-center justify-center ${isActive ? 'border-gray-600' : 'border-gray-200'}`}>
                    <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {session.progress}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <Animated.View layout={LinearTransition.springify()}>
          <TouchableOpacity
            onPress={() => router.push('/(onboarding)/create-session')}
            className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 w-32 h-full items-center justify-center"
          >
            <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mb-2">
              <Ionicons name="add" size={24} color="gray" />
            </View>
            <Text className="text-sm font-medium text-gray-500">New Session</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
