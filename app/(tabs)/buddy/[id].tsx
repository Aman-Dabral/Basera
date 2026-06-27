import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/store/useChatStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useAuthStore } from '@/store/auth';
import { sendMessageToBuddy } from '@/services/chatApi';

export default function BuddyChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { sessions, activeSessionId } = useSessionStore();
  const { messages: allMessages, addMessage, updateMessage } = useChatStore();
  
  const messages = allMessages[id] || [];
  const sessionContext = sessions.find(s => s.id === activeSessionId);
  
  const [isTyping, setIsTyping] = useState(false);

  // Default starter questions
  const starterQuestions = [
    "Help me find a place to live",
    "What should I know before I arrive?",
    "Teach me survival phrases"
  ];

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!sessionContext) return;
    
    // Optimistically add user message
    addMessage(id, newMessages);
    
    const userMsgText = newMessages[0].text;
    const botMsgId = Math.random().toString(36).substring(7);
    
    // Add empty bot message for streaming
    const initialBotMessage: IMessage = {
      _id: botMsgId,
      text: '',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Buddy',
        avatar: 'https://ui-avatars.com/api/?name=Buddy&background=000&color=fff',
      },
    };
    addMessage(id, initialBotMessage);
    
    setIsTyping(true);
    
    // Call mock API with streaming callback
    await sendMessageToBuddy(
      {
        sessionContext,
        userName: user?.name || 'Friend',
        userMessage: userMsgText
      },
      (tokenText) => {
        setIsTyping(false);
        updateMessage(id, botMsgId, { text: tokenText });
      },
      (fullText) => {
        setIsTyping(false);
        updateMessage(id, botMsgId, { text: fullText });
      }
    );
  }, [id, sessionContext, user, addMessage, updateMessage]);

  const handleStarterPress = (text: string) => {
    onSend([{
      _id: Math.random().toString(36).substring(7),
      text,
      createdAt: new Date(),
      user: { _id: 1 },
    }]);
  };

  const renderMessageText = (props: any) => {
    const text = props.currentMessage.text;
    
    // Parse for <CARD> JSON blocks
    const cardRegex = /<CARD>(.*?)<\/CARD>/;
    const match = text.match(cardRegex);
    
    if (match && match[1]) {
      try {
        const cardData = JSON.parse(match[1]);
        const cleanText = text.replace(cardRegex, '').trim();
        
        return (
          <View className="px-3 py-2">
            {cleanText ? <Text className={`text-base ${props.position === 'left' ? 'text-black' : 'text-white'} mb-3`}>{cleanText}</Text> : null}
            
            <View className="bg-white rounded-xl p-3 border border-gray-200 mt-1 mb-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name={cardData.type === 'place' ? 'location' : 'bulb'} size={16} color="#f97316" />
                <Text className="text-orange-500 font-bold ml-1 uppercase text-xs">{cardData.type}</Text>
              </View>
              <Text className="font-bold text-gray-900 text-base">{cardData.name}</Text>
              <Text className="text-gray-500 mt-1 text-sm">{cardData.description}</Text>
              <TouchableOpacity className="mt-3 bg-gray-100 py-2 rounded-lg items-center">
                <Text className="text-black font-semibold text-xs">Add to Saved</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } catch (e) {
        // Fallback to normal text if parsing fails
      }
    }
    
    return (
      <View className="px-3 py-2">
        <Text className={`text-base leading-6 ${props.position === 'left' ? 'text-black' : 'text-white'}`}>
          {text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      {/* Header Context Strip */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-100 bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 w-8 h-8 justify-center">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-bold text-lg text-gray-900">Buddy</Text>
          {sessionContext && (
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">{sessionContext.cityFrom}</Text>
              <Ionicons name="arrow-forward" size={10} color="gray" style={{ marginHorizontal: 4 }} />
              <Text className="text-xs text-gray-500">{sessionContext.cityTo}</Text>
            </View>
          )}
        </View>
      </View>

      {messages.length === 0 && (
        <View className="px-6 py-6 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Start the conversation</Text>
          <View className="gap-3">
            {starterQuestions.map((q, idx) => (
              <TouchableOpacity 
                key={idx}
                onPress={() => handleStarterPress(q)}
                className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex-row justify-between items-center"
              >
                <Text className="font-medium text-gray-700">{q}</Text>
                <Ionicons name="arrow-forward" size={16} color="gray" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View className="flex-1">
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderMessageText={renderMessageText}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: { backgroundColor: '#f3f4f6', borderRadius: 20, borderBottomLeftRadius: 4, padding: 2 },
                right: { backgroundColor: '#000000', borderRadius: 20, borderBottomRightRadius: 4, padding: 2 },
              }}
            />
          )}
          renderInputToolbar={(props) => (
            <InputToolbar 
              {...props} 
              containerStyle={{ borderTopColor: '#f3f4f6', borderTopWidth: 1, padding: 4 }}
            />
          )}
          isTyping={isTyping}
          bottomOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust for tabs if necessary, though this is a pushed screen
          placeholder="Message Buddy..."
        />
        {/* iOS Keyboard Avoiding handled automatically by GiftedChat, but android sometimes needs help */}
        {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
      </View>
    </SafeAreaView>
  );
}
