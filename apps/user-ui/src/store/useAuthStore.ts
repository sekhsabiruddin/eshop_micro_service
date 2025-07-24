import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // you can change this to `false` if you want to start logged out
  isLoggedIn: true,

  setLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
}));
