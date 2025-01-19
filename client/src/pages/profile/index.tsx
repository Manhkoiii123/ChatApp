import {
  createUserState,
  useAuthZustand,
  User,
} from "@/store/slices/authSlice";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
const Profile = () => {
  const nav = useNavigate();
  const user = useAuthZustand((state: createUserState) => state.user);
  const setUser = useAuthZustand((state: createUserState) => state.setUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user?.profileSetup) {
      setFirstName(user?.firstName);
      setLastName(user?.lastName);

      setSelectedColor(user?.color);
    }
    if (user?.image) {
      setImage(`${HOST}/${user?.image}`);
    }
  }, [
    user?.color,
    user?.firstName,
    user?.image,
    user?.lastName,
    user?.profileSetup,
  ]);
  const handleNavigate = () => {
    if (user?.profileSetup) {
      nav("/chat");
    } else {
      toast.error("Please setup your profile first");
    }
  };
  const validateProfile = () => {
    if (!firstName || !lastName) {
      toast.error("Please fill all the fields");
      return false;
    } else {
      return true;
    }
  };
  const saveChanges = async () => {
    if (!validateProfile()) return;
    try {
      const res = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          firstName,
          lastName,
          color: selectedColor,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200 && res.data.id) {
        setUser(res.data);
        toast.success("Profile updated successfully");
        nav("/chat");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("🚀 ~ saveChanges ~ error:", error);
    }
  };
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.image) {
          setUser({
            ...user,
            image: res.data.image,
          } as User);
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Something went wrong");
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.log("🚀 ~ handleImageChange ~ error:", error);
      }
    }
  };
  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUser({
          ...user,
          image: "",
        } as User);
        setImage("");
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteImage ~ error:", error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-0 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90  cursor-pointer " />
        </div>
        <div className="grid grid-cols-2 ">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ">
              {image ? (
                <AvatarImage
                  src={image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div
                  className={`uppercase w-32 h-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : user?.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                onClick={image ? handleDeleteImage : handleFileInputClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .webp, .svg"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 text-white flex-col gap-5 items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                value={user?.email}
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300  ${color} ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-3"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full mt-10">
          <Button
            onClick={saveChanges}
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
