import React, { useEffect, useState } from "react";
import { makeRequest } from "../../utils/api";
import Skeleton from "../Skeletons/ChatSkeleton";
import { useSocketContext } from "../../context/SocketContext";
import messageSound from '../../assets/notification.mp3'

const leftbar = ({
  setSelectedConversation,
  conversations,
  setConversations,
  selectedConversation,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { onlineUsers, socket,messages,  setMessages } = useSocketContext();



  const receipientId = selectedConversation?.participants?.[0]._id;

  // getting conversations of user
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await makeRequest.get("messages/conversations");
        setConversations(response?.data); // Assuming response.data is an array of conversations
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchUsers();
  }, []);

  // getting all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await makeRequest.get("auth/all-users");
        setAllUsers(response?.data.users); // Assuming response.data is an array of conversations
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to determine if a user is online or offline
  const isUserOnline = (userId) => {
    return onlineUsers.some((userid) => userid === userId);
  };

  // receving new message from socket io server
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      // make a sound if the window is not focused
			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          // update only that chat conversation for which this condition is true
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
                
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket?.off("newMessage");
  }, [socket, selectedConversation, setSelectedConversation]);

  return (
    <div className="w-1/3 px-5 py-4 border h-[100vh]">
      <div className="top text-2xl text-yellow-500 font-extrabold">DevChat</div>
      <hr className="mt-3" />
      {loading ? (
        <Skeleton />
      ) : (
        conversations?.map((conversation, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedConversation(conversation);
            }}
            className={`flex justify-between rounded-lg p-2 cursor-pointer ${
              receipientId === conversation.participants[0]._id &&
              "shadow-[0_3px_10px_rgb(0,0,0,0.2)] -translate-y-1"
            } hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:transition-transform md:duration-300 md:hover:-translate-y-[2px]`}
          >
            <div className="flex gap-x-3">
              <img
                class="w-11 h-11 rounded-full"
                src={conversation.participants[0].profilePic}
                alt="Rounded avatar"
              />
              <div className="flex flex-col justify-between">
                <p className="text-lg font-semibold">
                  {conversation.participants[0].name}
                </p>
                <p
                  className={`text-sm text-gray2`}
                >
                  {conversation.lastMessage.text}
                </p>
              </div>
            </div>
            <div className="time flex flex-col justify-between items-end text-sm">
              <p className="text-gray2">12:00 PM</p>
              <div
                className={`w-2 h-2 top-[67%] right-[2px] ${
                  isUserOnline(conversation.participants[0]._id)
                    ? "bg-lime-500"
                    : "bg-yellow-300"
                }  rounded-full`}
              ></div>
            </div>
          </div>
        ))
      )}

      <hr className="mt-8" />
      <div className="chat flex flex-col gap-y-2 mt-5">
        <p>All Users</p>
        {/* {loading ? (
          <Skeleton />
        ) : (
          allUsers?.map((user, index) => (
            <div
              key={index}
              // onClick={() => setChatSelected(user)}
              className={`flex justify-between rounded-lg p-2 cursor-pointer ${
                receipientId === user._id &&
                "shadow-[0_3px_10px_rgb(0,0,0,0.2)] -translate-y-1"
              } hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:transition-transform md:duration-300 md:hover:-translate-y-[2px]`}
            >
              <div className="flex gap-x-3">
                <img
                  class="w-11 h-11 rounded-full"
                  src={user.profilePic}
                  alt="Rounded avatar"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray2 font-semibold"></p>
                </div>
              </div>
              <div className="time flex flex-col justify-between items-end text-sm">
                <p className="text-gray2">12:00 PM</p>
                <div
                  className={`w-2 h-2 top-[67%] right-[2px] ${
                    isUserOnline(user._id) ? "bg-lime-500" : "bg-yellow-300"
                  }  rounded-full`}
                ></div>
              </div>
            </div>
          ))
        )} */}
      </div>
    </div>
  );
};

export default leftbar;
