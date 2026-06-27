import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { useSessionStore } from '@/store/useSessionStore';
import SessionSwitcher from '@/components/SessionSwitcher';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTab() {
  const { user } = useAuthStore();
  const { sessions, activeSessionId } = useSessionStore();
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <View className="flex-1 bg-white pt-16">
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-gray-500 font-medium">Hello, {user?.name || 'Local'}</Text>
          <Text className="text-2xl font-bold">Your Sessions</Text>
        </View>
        <Image 
          source={{ uri: user?.photoUrl || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=random' }} 
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </View>

      <SessionSwitcher />

      {activeSession ? (
        <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="bg-orange-50 rounded-3xl p-6 mb-8 border border-orange-100">
            <View className="flex-row items-center mb-3">
              <Ionicons name="flame" size={20} color="#f97316" />
              <Text className="text-orange-500 font-bold ml-1">{activeSession.streak} Day Streak</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Explore {activeSession.cityTo}
            </Text>
            <Text className="text-gray-600 mb-6 leading-5">
              Today's action: Visit a local cafe and practice ordering in {activeSession.languages.length > 0 ? activeSession.languages[0] : 'the local language'}.
            </Text>
            <TouchableOpacity className="bg-black py-4 px-6 rounded-xl self-start flex-row items-center">
              <Text className="text-white font-semibold mr-2">Start Action</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold mb-4">Quick Links</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {[
              { title: 'Explore', icon: 'compass', color: 'bg-blue-50', iconColor: '#3b82f6' },
              { title: 'Learn', icon: 'book', color: 'bg-green-50', iconColor: '#22c55e' },
              { title: 'Recall', icon: 'sync', color: 'bg-purple-50', iconColor: '#a855f7' },
              { title: 'Buddy', icon: 'chatbubbles', color: 'bg-pink-50', iconColor: '#ec4899' },
            ].map((link, idx) => (
              <TouchableOpacity key={idx} className={`w-[48%] ${link.color} p-5 rounded-3xl items-start`}>
                <View className="bg-white p-2.5 rounded-full mb-3 shadow-sm">
                  <Ionicons name={link.icon as any} size={20} color={link.iconColor} />
                </View>
                <Text className="font-bold text-gray-800 text-base">{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Image 
            source={require('@/assets/illustrations/empty-sessions.png')} 
            className="w-48 h-48 mb-6 opacity-80"
            resizeMode="contain"
          />
          <Text className="text-xl font-semibold text-center mb-2">No active session</Text>
          <Text className="text-gray-500 text-center mb-8">
            Select a session from the top or create a new one to get started.
          </Text>
        </View>
      )}
    </View>
  );
}
