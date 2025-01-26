/* eslint-disable @typescript-eslint/no-explicit-any */
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
  selectedChatMessages: any;
  setSelectedChatType: (type: string) => void;
  setSelectedChatData: (data: Contact) => void;
  closeChat: () => void;
  setSelectedChatMessages: (messages: []) => void;
  addMessage: (message: any) => void;
  directMessagesContacts: [];
  setDirectMessagesContacts: (contacts: []) => void;
};
export const useChatZustand = create<createContactState>((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatType: (type: string) => set({ selectedChatType: type }),
  setSelectedChatData: (data: Contact) => set({ selectedChatData: data }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  addMessage: (message: any) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  directMessagesContacts: [],
  setDirectMessagesContacts: (contacts) =>
    set({ directMessagesContacts: contacts }),
}));
