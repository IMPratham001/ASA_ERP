import { create } from 'zustand';

interface Store {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive';
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  setStores: (stores: Store[]) => void;
  setCurrentStore: (store: Store) => void;
}

export const useStore = create<StoreState>((set) => ({
  stores: [
    {
      id: '1',
      name: 'Main Store',
      region: 'North',
      status: 'active',
    },
    {
      id: '2',
      name: 'Branch Store',
      region: 'South',
      status: 'active',
    },
  ],
  currentStore: null,
  setStores: (stores) => set({ stores }),
  setCurrentStore: (store) => set({ currentStore: store }),
}));