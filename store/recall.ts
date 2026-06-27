import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const SecureStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export type CardSource = 'Language' | 'Places' | 'Culture';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  source: CardSource;
  
  // SM-2 parameters
  interval: number; // Days until next review
  repetitions: number;
  easeFactor: number;
  dueDate: string; // ISO string
}

export type Rating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface RecallState {
  cards: Flashcard[];
  history: Record<string, number>; // date (YYYY-MM-DD) -> reviews completed
  
  addCard: (front: string, back: string, source: CardSource) => void;
  reviewCard: (id: string, rating: Rating) => void;
  getDueCards: () => Flashcard[];
}

// SM-2 Constants
const INITIAL_EASE = 2.5;

function getTodayString() {
  const d = new Date();
  // Adjust for local timezone if needed, simple ISO slice for now
  return d.toISOString().split('T')[0];
}

export const useRecallStore = create<RecallState>()(
  persist(
    (set, get) => ({
      cards: [],
      history: {},

      addCard: (front, back, source) => {
        const newCard: Flashcard = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          front,
          back,
          source,
          interval: 0,
          repetitions: 0,
          easeFactor: INITIAL_EASE,
          dueDate: new Date().toISOString(), // Due immediately
        };
        
        set((state) => ({
          cards: [...state.cards, newCard],
        }));
      },

      reviewCard: (id, rating) => {
        set((state) => {
          let quality = 0;
          switch (rating) {
            case 'Again': quality = 0; break;
            case 'Hard': quality = 3; break;
            case 'Good': quality = 4; break;
            case 'Easy': quality = 5; break;
          }

          const updatedCards = state.cards.map(card => {
            if (card.id !== id) return card;

            let { repetitions, interval, easeFactor } = card;

            if (quality < 3) {
              repetitions = 0;
              interval = 1; // Try again tomorrow
            } else {
              if (repetitions === 0) {
                interval = 1;
              } else if (repetitions === 1) {
                interval = 6;
              } else {
                interval = Math.round(interval * easeFactor);
              }
              repetitions++;
            }

            easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            if (easeFactor < 1.3) easeFactor = 1.3;

            const nextDueDate = new Date();
            nextDueDate.setDate(nextDueDate.getDate() + interval);

            return {
              ...card,
              repetitions,
              interval,
              easeFactor,
              dueDate: nextDueDate.toISOString(),
            };
          });

          // Update history
          const today = getTodayString();
          const newHistory = { ...state.history };
          newHistory[today] = (newHistory[today] || 0) + 1;

          return {
            cards: updatedCards,
            history: newHistory,
          };
        });
      },

      getDueCards: () => {
        const now = new Date();
        return get().cards.filter(card => new Date(card.dueDate) <= now);
      },
    }),
    {
      name: 'basera-recall-storage',
      storage: createJSONStorage(() => SecureStorageAdapter),
    }
  )
);
