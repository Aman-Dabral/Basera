import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';

export default function CreateSessionScreen() {
  const router = useRouter();
  const { incrementSessionCount } = useAuthStore();

  const handleCreateSession = () => {
    // In a real app, this would make an API call to create the session
    // For now, we mock the creation by incrementing the session count
    incrementSessionCount();
    
    // The layout component handles the routing based on sessionsCount automatically
    // but we can also explicitly push if needed.
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-white pt-12 px-6">
      <View className="flex-1 justify-center items-center">
        <Image 
          source={require('@/assets/illustrations/onboarding-howitworks.png')} 
          className="w-64 h-64 mb-8"
          resizeMode="contain"
        />
        
        <Text className="text-3xl font-semibold text-center mb-4">
          Ready to explore?
        </Text>
        <Text className="text-gray-500 text-center text-lg mb-12 px-4">
          Create your first session to start discovering your city like a local.
        </Text>

        <TouchableOpacity 
          className="w-full bg-black py-4 rounded-xl flex-row justify-center items-center shadow-sm"
          onPress={handleCreateSession}
        >
          <Text className="text-white font-semibold text-lg mr-2">Create your first session</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
