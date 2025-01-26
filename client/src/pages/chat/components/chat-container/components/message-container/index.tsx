/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useAuthZustand } from "@/store/slices/authSlice";
import { useChatZustand } from "@/store/slices/chatSlice";
import { useEffect, useRef } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useChatZustand((state) => state);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          {
            id: selectedChatData?._id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error: any) {
        console.log("🚀 ~ getMessages ~ error", error);
      }
    };
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  const renderMessage = () => {
    let lastDate: any = null;
    return (selectedChatMessages || []).map((message: any, index: number) => {
      const messageDate = moment(message.timestamps).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamps).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
        </div>
      );
    });
  };
  const renderDMMessage = (message: any) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData?._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" ? (
          <>
            <div
              className={`${
                message.sender !== selectedChatData?._id
                  ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[1px] border-[#8417ff]/50"
                  : "bg-[#2a2b33]/5 text-white/80 border-[1px] border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            >
              {message.content}
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="text-xs text-gray-500">
          {moment(message.timestamps).format("LT")}
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]  w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
