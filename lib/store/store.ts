import { create } from 'zustand';

interface Store {
  user: any | null;
  setUser: (user: any) => void;
  selectedStore: string | null;
  setSelectedStore: (store: string) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
}));