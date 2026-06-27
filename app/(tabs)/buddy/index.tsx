import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/store/useChatStore';
import { useSessionStore } from '@/store/useSessionStore';

export default function BuddyConversationList() {
  const router = useRouter();
  const { conversations, createConversation } = useChatStore();
  const { activeSessionId } = useSessionStore();

  const activeConversations = conversations.filter(c => c.sessionId === activeSessionId);

  const handleNewChat = () => {
    if (!activeSessionId) return;
    const newId = createConversation(activeSessionId, 'New Chat');
    router.push(`/buddy/${newId}`);
  };

  return (
    <View className="flex-1 bg-white pt-16">
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Text className="text-3xl font-bold">Buddy</Text>
        <TouchableOpacity 
          onPress={handleNewChat}
          className="bg-black w-10 h-10 rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {activeConversations.length > 0 ? (
        <ScrollView className="flex-1 px-4">
          {activeConversations.map((conv) => (
            <TouchableOpacity 
              key={conv.id}
              className="flex-row items-center p-4 border-b border-gray-100"
              onPress={() => router.push(`/buddy/${conv.id}`)}
            >
              <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center mr-4">
                <Ionicons name="chatbubble-ellipses" size={24} color="#f97316" />
              </View>
              <View className="flex-1 justify-center">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-semibold text-lg text-gray-900" numberOfLines={1}>{conv.title}</Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm" numberOfLines={2}>
                  {conv.lastMessagePreview || 'New conversation'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center px-6 pb-20">
          <Image 
            source={require('@/assets/illustrations/empty-chat.png')} 
            className="w-56 h-56 mb-8 opacity-90"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-center mb-3">Say hi to Buddy!</Text>
          <Text className="text-gray-500 text-center mb-8 px-4 text-base">
            Your personal local friend is ready to help you navigate and explore.
          </Text>
          <TouchableOpacity 
            className="w-full bg-black py-4 rounded-xl flex-row justify-center items-center shadow-sm"
            onPress={handleNewChat}
          >
            <Text className="text-white font-semibold text-lg mr-2">Start a New Chat</Text>
            <Ionicons name="chatbubbles" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
