/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthZustand } from "@/store/slices/authSlice";
import { useChatZustand } from "@/store/slices/chatSlice";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthZustand((state) => state);

  useEffect(() => {
    if (user) {
      const newSocket = io(HOST, {
        withCredentials: true,
        query: {
          userId: user.id,
        },
      });

      newSocket.on("connect", () => {
        console.log("connected");
      });

      const handleRecieveMessage = (message: any) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useChatZustand.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient._id)
        ) {
          addMessage(message);
        }
      };

      newSocket.on("recieveMessage", handleRecieveMessage);

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      setSocket(null); // Reset the socket if user logs out
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
