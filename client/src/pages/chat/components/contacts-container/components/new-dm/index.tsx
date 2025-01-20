import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Contact, useChatZustand } from "@/store/slices/chatSlice";
const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useChatZustand(
    (state) => state
  );
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const searchContact = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          {
            searchTerm,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log("🚀 ~ searchContact ~ error:", error);
    }
  };
  const selectContact = (contact: Contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => {
                setOpenNewContactModal(true);
              }}
              className="text-neutral-400 font-light text-opacity-90 hover:text-white duration-300 transition-all"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select new contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#1c1b1e] border-none w-[400px] h-[400px] text-white flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts..."
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                searchContact(e.target.value);
              }}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact: Contact) => (
                  <div
                    key={contact._id}
                    onClick={() => selectContact(contact)}
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="w-12 h-12   rounded-full overflow-hidden ">
                        {contact?.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact?.image}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div
                            className={`uppercase w-12 h-12   text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact?.color
                            )}`}
                          >
                            {contact?.firstName
                              ? contact?.firstName.split("").shift()
                              : contact?.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      {contact?.firstName && contact?.lastName ? (
                        <p className="text-white font-medium">
                          {contact?.firstName} {contact?.lastName}
                        </p>
                      ) : (
                        <p className="text-white font-medium">
                          {contact?.email}
                        </p>
                      )}
                      <span className="text-xs">{contact?.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1  md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                options={animationDefaultOptions}
                height={100}
                width={100}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-6 text-3xl lg:text-2xl transition-all duration-300 text-center ">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contacts</span>
                  <span className="text-purple-500">.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
