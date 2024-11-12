import { create } from "zustand";
import { User } from "@/types/User";
import { clearUserFromPreferences } from "./sharedPreferences";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => {
    set({ user: null });
    clearUserFromPreferences();
  },
}));

export default useUserStore;
