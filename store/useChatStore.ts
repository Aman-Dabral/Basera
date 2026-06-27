import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMessage } from 'react-native-gifted-chat';

export interface Conversation {
  id: string;
  sessionId: string;
  title: string;
  lastMessagePreview: string;
  updatedAt: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, IMessage[]>;
  
  createConversation: (sessionId: string, title?: string) => string;
  addMessage: (conversationId: string, message: IMessage | IMessage[]) => void;
  updateMessage: (conversationId: string, messageId: string | number, partialMsg: Partial<IMessage>) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},

      createConversation: (sessionId, title) => {
        const id = Math.random().toString(36).substring(7);
        const newConv: Conversation = {
          id,
          sessionId,
          title: title || 'New Chat',
          lastMessagePreview: '',
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          messages: { ...state.messages, [id]: [] }
        }));
        
        return id;
      },

      addMessage: (conversationId, message) => {
        set((state) => {
          const newMessages = Array.isArray(message) ? message : [message];
          const existingMessages = state.messages[conversationId] || [];
          const updatedMessages = [...newMessages, ...existingMessages]; // GiftedChat inverted = most recent at 0 index
          
          const preview = newMessages.length > 0 && typeof newMessages[0].text === 'string' 
            ? newMessages[0].text.substring(0, 50) 
            : 'Sent an attachment';

          const updatedConvs = state.conversations.map(c => 
            c.id === conversationId ? { ...c, lastMessagePreview: preview, updatedAt: Date.now() } : c
          ).sort((a, b) => b.updatedAt - a.updatedAt);

          return {
            messages: { ...state.messages, [conversationId]: updatedMessages },
            conversations: updatedConvs
          };
        });
      },

      updateMessage: (conversationId, messageId, partialMsg) => {
        set((state) => {
          const conversationMsgs = state.messages[conversationId] || [];
          const updatedMsgs = conversationMsgs.map(m => 
            m._id === messageId ? { ...m, ...partialMsg } : m
          );
          
          return {
            messages: { ...state.messages, [conversationId]: updatedMsgs }
          };
        });
      }
    }),
    {
      name: 'basera-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
