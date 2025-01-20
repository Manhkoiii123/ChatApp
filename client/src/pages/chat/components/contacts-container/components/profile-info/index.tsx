import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAuthZustand } from "@/store/slices/authSlice";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
const ProfileInfo = () => {
  const user = useAuthZustand((state) => state.user);
  const removeUser = useAuthZustand((state) => state.removeUser);
  const nav = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("Logged out successfully");
        removeUser();
        nav("/auth");
      }
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center ">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12   rounded-full overflow-hidden ">
            {user?.image ? (
              <AvatarImage
                src={`${HOST}/${user?.image}`}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <div
                className={`uppercase w-12 h-12   text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  user?.color
                )}`}
              >
                {user?.firstName
                  ? user?.firstName.split("").shift()
                  : user?.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {user?.firstName && user?.lastName ? (
            <p className="text-white font-medium">
              {user?.firstName} {user?.lastName}
            </p>
          ) : (
            <p className="text-white font-medium">{user?.email}</p>
          )}
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaEdit
                onClick={() => {
                  nav("/profile");
                }}
                className="text-purple-500 text-xl  cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOutOutline
                onClick={handleLogout}
                className="text-red-500 text-2xl  cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
