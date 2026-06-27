import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (userInfo: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      loginWithEmail: async (email, password) => {
        // MOCK BACKEND CALL
        console.log('[MOCK] Logging in with email:', email);
        return new Promise((resolve) => {
          setTimeout(() => {
            set({
              user: { id: 'mock-id-1', email },
              isAuthenticated: true,
            });
            resolve();
          }, 500);
        });
      },

      signupWithEmail: async (email, password) => {
        // MOCK BACKEND CALL
        console.log('[MOCK] Signing up with email:', email);
        return new Promise((resolve) => {
          setTimeout(() => {
            set({
              user: { id: 'mock-id-new', email },
              isAuthenticated: true,
            });
            resolve();
          }, 500);
        });
      },

      loginWithGoogle: async (userInfo) => {
        // MOCK BACKEND CALL
        console.log('[MOCK] Logging in with Google info:', userInfo);
        return new Promise((resolve) => {
          setTimeout(() => {
            set({
              user: { 
                id: userInfo.id || 'mock-google-id', 
                email: userInfo.email,
                name: userInfo.name,
                photoUrl: userInfo.picture,
              },
              isAuthenticated: true,
            });
            resolve();
          }, 500);
        });
      },

      logout: async () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'basera-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
