/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useAuthZustand } from "@/store/slices/authSlice";
import { useChatZustand } from "@/store/slices/chatSlice";
import { useEffect, useRef } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
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
  const downloadFile = async (file: any) => {
    const res = await apiClient.get(`${HOST}/${file}`, {
      responseType: "blob",
      withCredentials: true,
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };
  const checkIfImage = (url: string) => {
    const imageRegex =
      /\.(jpeg|jpg|gif|png|bmp|tiff|tif|webp|svg|ico|heif|heic)$/i;
    return imageRegex.test(url);
  };
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
        {message.messageType === "text" && (
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
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[1px] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[1px] border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer ">
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="file"
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-white/80 p-3 text-3xl bg-black/20 rounded-full">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
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
