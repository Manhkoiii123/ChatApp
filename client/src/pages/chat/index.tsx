import ChatContainer from "@/pages/chat/components/chat-container";
import ContactsContainer from "@/pages/chat/components/contacts-container";
import EmptyChatContainer from "@/pages/chat/components/empty-chat-container";
import { createUserState, useAuthZustand } from "@/store/slices/authSlice";
import { useChatZustand } from "@/store/slices/chatSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const user = useAuthZustand((state: createUserState) => state.user);
  const { selectedChatType } = useChatZustand((state) => state);
  const nav = useNavigate();
  useEffect(() => {
    if (!user?.profileSetup) {
      toast("Please setup your profile first");
      nav("/profile");
    }
  }, [nav, user]);
  return (
    <div className="flex h-screen text-white overflow-hidden ">
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
