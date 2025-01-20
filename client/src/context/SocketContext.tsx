/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthZustand } from "@/store/slices/authSlice";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<ReturnType<typeof io> | null>(null);
  const { user } = useAuthZustand((state) => state);

  useEffect(() => {
    if (user) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: user.id,
        },
      });
      socket.current.on("connect", () => {
        console.log("connected");
      });
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [user]);
  return (
    <SocketContext.Provider value={socket.current as any}>
      {children}
    </SocketContext.Provider>
  );
};
