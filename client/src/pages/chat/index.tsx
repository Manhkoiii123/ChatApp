import { createUserState, useAuthZustand } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const user = useAuthZustand((state: createUserState) => state.user);
  const nav = useNavigate();
  useEffect(() => {
    if (!user?.profileSetup) {
      toast("Please setup your profile first");
      nav("/profile");
    }
  }, [nav, user]);
  return <div>Chat</div>;
};

export default Chat;
