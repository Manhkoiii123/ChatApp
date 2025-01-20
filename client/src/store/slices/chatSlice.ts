import { create } from "zustand";
export type Contact = {
  color: number;
  email: string;
  firstName: string;
  image: string;
  lastName: string;
  password: string;
  profileSetup: true;
  _id: string;
};
export type createContactState = {
  selectedChatType: string | undefined;
  selectedChatData: Contact | undefined;
  selectedChatMessages: [] | undefined;
  setSelectedChatType: (type: string) => void;
  setSelectedChatData: (data: Contact) => void;
  closeChat: () => void;
  setSelectedChatMessages: (messages: []) => void;
};
export const useChatZustand = create<createContactState>((set) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: undefined,
  setSelectedChatType: (type: string) => set({ selectedChatType: type }),
  setSelectedChatData: (data: Contact) => set({ selectedChatData: data }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  setSelectedChatMessages: (messages: []) =>
    set({ selectedChatMessages: messages }),
}));
