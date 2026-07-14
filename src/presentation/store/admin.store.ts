import { create } from 'zustand';

interface AdminState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  
  isLoadingGlobal: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  
  isLoadingGlobal: false,
  setGlobalLoading: (loading) => set({ isLoadingGlobal: loading }),
}));
