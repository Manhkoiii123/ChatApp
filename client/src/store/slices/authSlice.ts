import { create } from "zustand";
export type User = {
  email: string;
  id: string;
  profileSetup: boolean;
  firstName: string;
  lastName: string;
  image: string;
  color: number;
};
export type createUserState = {
  user: User | null;
  setUser: (value: User) => void;
  removeUser: () => void;
};
export const useAuthZustand = create<createUserState>((set) => ({
  user: null,
  setUser: (value: User | null) => set({ user: value }),
  removeUser: () => set({ user: null }),
}));
