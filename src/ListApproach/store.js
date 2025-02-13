import { create } from "zustand";

export const useAnswerStore = create((set) => ({
  answer: [],
  updateAnswer: (data) => set(() => ({ answer: data })),
  resetAnswer: () => set(() => []),
  countAnswer: () => (state) => state.answer.length,
}));
