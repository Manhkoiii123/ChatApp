/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useChatZustand } from "@/store/slices/chatSlice";
import { useSocket } from "@/context/SocketContext";
import { useAuthZustand } from "@/store/slices/authSlice";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
const MessageBar = () => {
  const { selectedChatData, selectedChatType } = useChatZustand(
    (state) => state
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthZustand((state) => state);
  const socket = useSocket();
  const emojiRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  const handleSendMessage = () => {
    if (selectedChatType === "contact") {
      if (socket) {
        socket.emit("sendMessage", {
          sender: user!.id,
          content: message,
          recipient: selectedChatData!._id,
          messageType: "text",
          fileUrl: undefined,
        });
      }
    }
  };
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  const handleEmojiClick = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };
  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files![0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data) {
          if (selectedChatType === "contact" && socket) {
            socket.emit("sendMessage", {
              sender: user!.id,
              content: undefined,
              recipient: selectedChatData!._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 mr-5">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-transparent flex-1 p-5 rounded-md focus:border-none focus:outline-none focus:ring-0"
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl text-neutral-500" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative ">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl text-neutral-500" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={handleEmojiClick}
              open={showEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] rounded-md flex items-center justify-center p-5 text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
