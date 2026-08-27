"use client";

import { create } from "zustand";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface SignInPromptState {
  open: boolean;
  openPrompt: () => void;
  closePrompt: () => void;
}

export const useSignInPrompt = create<SignInPromptState>((set) => ({
  open: false,
  openPrompt: () => set({ open: true }),
  closePrompt: () => set({ open: false }),
}));

export function offerSignInIfSignedOut() {
  if (!useAuthStore.getState().token) {
    useSignInPrompt.getState().openPrompt();
  }
}