import { create } from 'zustand';

interface ModalState {
  historyOpen: boolean;
  rankingOpen: boolean;
  
  openHistory: () => void;
  closeHistory: () => void;
  openRanking: () => void;
  closeRanking: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  historyOpen: false,
  rankingOpen: false,
  
  openHistory: () => set({ historyOpen: true, rankingOpen: false }),
  closeHistory: () => set({ historyOpen: false }),
  openRanking: () => set({ rankingOpen: true, historyOpen: false }),
  closeRanking: () => set({ rankingOpen: false }),
  closeAll: () => set({ historyOpen: false, rankingOpen: false }),
}));
