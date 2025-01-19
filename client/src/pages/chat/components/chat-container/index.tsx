import ChatHeader from "@/pages/chat/components/chat-container/components/chat-header";
import MessageBar from "@/pages/chat/components/chat-container/components/message-bar";
import MessageContainer from "@/pages/chat/components/chat-container/components/message-container";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-screen w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
