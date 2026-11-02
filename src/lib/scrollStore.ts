import { create } from 'zustand';

type ScrollState = {
  /** 0 = rim (hero), 1 = pit floor (end of descent). */
  descent: number;
  heroVisible: boolean;
  descentVisible: boolean;
  set: (partial: Partial<Omit<ScrollState, 'set'>>) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  descent: 0,
  heroVisible: true,
  descentVisible: false,
  set: (partial) => set(partial),
}));
