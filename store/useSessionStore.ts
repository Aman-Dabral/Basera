import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ActiveSession {
  id: string;
  cityFrom: string;
  cityTo: string;
  languages: string[];
  pullReason: string;
  createdAt: number;
  lastActiveAt: number;
  progress: number;
  streak: number;
}

interface SessionState {
  sessions: ActiveSession[];
  activeSessionId: string | null;
  
  // Actions
  createSession: (sessionData: Omit<ActiveSession, 'id' | 'createdAt' | 'lastActiveAt' | 'progress' | 'streak'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  setActiveSession: (id: string) => void;
  clearAllSessions: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: [],
      activeSessionId: null,

      createSession: async (sessionData) => {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const newSession: ActiveSession = {
          ...sessionData,
          id: Math.random().toString(36).substring(7),
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
          progress: 0,
          streak: 0,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          activeSessionId: newSession.id,
        }));
      },

      deleteSession: async (id) => {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          const updatedSessions = state.sessions.filter((s) => s.id !== id);
          return {
            sessions: updatedSessions,
            activeSessionId: state.activeSessionId === id 
              ? (updatedSessions.length > 0 ? updatedSessions[0].id : null) 
              : state.activeSessionId
          };
        });
      },

      setActiveSession: (id) => set((state) => {
        const updatedSessions = state.sessions.map(s => 
          s.id === id ? { ...s, lastActiveAt: Date.now() } : s
        );
        return { activeSessionId: id, sessions: updatedSessions };
      }),

      clearAllSessions: () => set({ sessions: [], activeSessionId: null }),
    }),
    {
      name: 'basera-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
