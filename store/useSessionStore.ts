import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ActiveSession {
  id: string;
  cityFrom: string;
  cityTo: string;
  createdAt: number;
  progress: number;
}

interface SessionState {
  activeSession: ActiveSession | null;
  setActiveSession: (session: ActiveSession) => void;
  clearActiveSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      activeSession: null,
      setActiveSession: (session) => set({ activeSession: session }),
      clearActiveSession: () => set({ activeSession: null }),
    }),
    {
      name: 'basera-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
