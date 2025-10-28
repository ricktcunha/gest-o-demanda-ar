import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  cards: [],
  isLoading: false,
  activeTab: 'overview',
  
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  getFilteredCards: () => {
    return get().cards;
  },
  
  getCardsByResponsible: () => {
    return {};
  },
}));