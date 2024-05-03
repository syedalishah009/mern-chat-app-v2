import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import MessagesSkeleton from "../Skeletons/MessagesSkeleton";
import { makeRequest } from "../../utils/api";
import { useSocketContext } from "../../context/SocketContext";

const Messages = ({ loading, messages, chatSelected }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sendMessage, setSendMessage] = useState("");
  const { socket, onlineUsers } = useSocketContext();
  const messagesRef = useRef(null);

   // Function to determine if a user is online or offline
   const isUserOnline = (userId) => {
    return onlineUsers.some((user) => user.userId === userId);
  };


  useEffect(() => {
    // Scrolls the messages div to the bottom when component is mounted or messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: chatSelected?._id,
      message: sendMessage,
    });
    setSendMessage("");
  };

  return (
    <div className="messages w-full ">
      
      <div className="top w-full shadow-lg h-20 flex p-3">
        <div className="flex gap-x-4">
          <img
            class="w-10 h-10 rounded-full"
            src={chatSelected?.profilePic}
            alt="Rounded avatar"
          />
          <div className="flex flex-col justify-between ">
            <p className="text-lg font-semibold">{chatSelected?.name}</p>
            <p className="text-sm text-gray2 font-semibold">{isUserOnline(chatSelected?._id) ? "online" : "offline"}</p>
          </div>
        </div>
      </div>

      <div class="border h-[85.50vh] ">
        <div class="flex-grow  overflow-y-auto h-full px-8 pt-8 text-left text-gray-700" ref={messagesRef}>
          {loading ? (
            <MessagesSkeleton />
          ) : messages ? (
            messages?.map((message) => (
              <div class="relative mb-6 text-left">
                <div class="text-gray-700">
                  <div
                    class={`relative  mr-8 sm:mr-16 inline-block rounded-md ${
                      user._id === message.senderId
                        ? "bg-blue-700 float-right text-white"
                        : "bg-gray-200 float-left text-black"
                    } py-3 px-4`}
                  >
                    <p class="text-sm">{message.message}</p>
                    {/* <p>{user._id === message.senderId ? "me" : "he"}</p> */}
                  </div>
                </div>
                <div class="clear-both flex text-gray-700"></div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center mb-48 text-lg font-semibold">
              <p>Send message to start chat</p>
            </div>
          )}

          <div class="flex items-center gap-x-2 border-t  border-gray-300 sm:p-4 py-2 text-left  text-gray-700">
            <input
              onChange={(e) => setSendMessage(e.target.value)}
              value={sendMessage}
              type="text"
              className="w-full px-4 py-4 h-8 border rounded-full border-gray-400 outline-none"
            />
            <IoMdSend onClick={handleSendMessage} className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
