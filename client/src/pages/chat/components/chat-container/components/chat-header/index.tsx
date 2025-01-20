import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useChatZustand } from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useChatZustand(
    (state) => state
  );
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center ">
          <div className="w-12 h-12 relative">
            <Avatar className="w-12 h-12   rounded-full overflow-hidden ">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData?.image}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div
                  className={`uppercase w-12 h-12   text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData?.color
                  )}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData?.firstName.split("").shift()
                    : selectedChatData?.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "contact" && selectedChatData?.firstName
              ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
              : selectedChatData?.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
