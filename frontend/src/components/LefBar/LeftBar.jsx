import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeRequest } from "../../utils/api";
import Skeleton from "../Skeletons/ChatSkeleton";
import { useSocketContext } from "../../context/SocketContext";

const leftbar = ({ setChatSelected, chatSelected }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocketContext()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await makeRequest.get("auth/all-users");
        setAllUsers(response.data.users); // Assuming response.data is an array of conversations
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to determine if a user is online or offline
  const isUserOnline = (userId) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  // const chat = [
  //   {
  //     id: 1,
  //     name: "Jainy",
  //     img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     unreadMessage: "Hi! how are you",
  //     time: "12:00 PM",
  //     status: "online",
  //   },
  //   {
  //     id: 2,
  //     name: "Jhon Dev",
  //     img: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     unreadMessage: "Hello",
  //     time: "11:00 PM",
  //     status: "online",
  //   },
  //   {
  //     id: 3,
  //     name: "Henry",
  //     img: "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     unreadMessage: "Hello",
  //     time: "11:00 PM",
  //     status: "online",
  //   },
  // ];
  return (
    <div className="w-1/3 px-5 py-4 border h-[100vh]">
      <div className="top text-2xl text-yellow-500 font-extrabold">DevChat</div>
      <hr className="mt-3" />
      <div className="chat flex flex-col gap-y-2 mt-5">
        {loading ? (
          <Skeleton />
        ) : (
          allUsers?.map((user, index) => (
            <div
              key={index}
              onClick={() => setChatSelected(user)}
              className={`flex justify-between rounded-lg p-2 cursor-pointer ${
                chatSelected?._id === user._id &&
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
                  <p className="text-sm text-gray2 font-semibold">
                    {/* {chat.unreadMessage} */}
                  </p>
                </div>
              </div>
              <div className="time flex flex-col justify-between items-end text-sm">
                <p className="text-gray2">12:00 PM</p>
                <div className={`w-2 h-2 top-[67%] right-[2px] ${isUserOnline(user._id) ? 'bg-lime-500' : "bg-yellow-300"}  rounded-full`}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default leftbar;
