import { create } from 'zustand';

export interface StoreState {
  currentCommentToReplyToId: string | null;
  setCurrentCommentToReplyToId: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentCommentToReplyToId: null,
  setCurrentCommentToReplyToId: (id: string) => set(() => ({ currentCommentToReplyToId: id })),
}));
