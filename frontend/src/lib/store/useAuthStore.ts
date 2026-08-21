import { create } from "zustand";
import {
  EMPTY_ACCOUNT_PROFILE,
  type AccountProfile,
  type AccountSession,
  clearStoredAccountProfile,
  getStoredAccountProfile,
  getStoredAccountToken,
  saveStoredAccountSession,
} from "@/lib/account";

interface AuthStore {
  token: string;
  profile: AccountProfile;
  hydrated: boolean;
  hydrate: () => void;
  signIn: (session: AccountSession) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  profile: EMPTY_ACCOUNT_PROFILE,
  hydrated: false,

  hydrate: () =>
    set((state) => {
      const token = getStoredAccountToken();
      const profile = getStoredAccountProfile();
      if (
        state.hydrated &&
        state.token === token &&
        JSON.stringify(state.profile) === JSON.stringify(profile)
      ) {
        return state;
      }
      return { token, profile, hydrated: true };
    }),

  signIn: (session) => {
    saveStoredAccountSession(session);
    set({ token: session.token, profile: session.user, hydrated: true });
  },

  signOut: () => {
    clearStoredAccountProfile();
    set({ token: "", profile: EMPTY_ACCOUNT_PROFILE });
  },
}));
