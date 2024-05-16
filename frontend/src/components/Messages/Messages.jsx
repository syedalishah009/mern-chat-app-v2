import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import MessagesSkeleton from "../Skeletons/MessagesSkeleton";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { makeRequest } from "../../utils/api";
import { useSocketContext } from "../../context/SocketContext";

const Messages = ({ selectedConversation, setConversations }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [sendMessage, setSendMessage] = useState("");
  const { socket, messages, setMessages, onlineUsers } = useSocketContext();
  const [loading, setLoading] = useState(false);

  const receipientId = selectedConversation?.participants?.[0]._id;

  const messagesRef = useRef(null);

  // Function to determine if a user is online or offline
  const isUserOnline = (userId) => {
    return onlineUsers.some((userid) => userid === userId);
  };

  useEffect(() => {
    // Scrolls the messages div to the bottom when component is mounted or messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // getting all messages
  useEffect(() => {
    if (receipientId) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const res = await makeRequest.get(
            `messages/all-messages/${receipientId}`
          );
          setMessages(res?.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("error while fetching messages", error);
        }
      };
      fetchMessages();
    }
  }, [receipientId, selectedConversation]);

  // update unseen messages
  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== user._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userToChat: receipientId,
      });
    }

    // recieve the notification that messages have been seen so we have to update the messages state
    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, messages, user._id, selectedConversation]);

  // send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await makeRequest.post(
        `messages/send-message/${receipientId}`,
        {
          message: sendMessage,
        }
      );
      setMessages((messages) => [...messages, res?.data]);

      // update the latestMessage in the conversation
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: res?.data.text,
                sender: res?.data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    } catch (error) {
      console.log("error sending message", error);
    }
    setSendMessage("");
  };

  return (
    <div className="messages w-full ">
      <div className="top w-full shadow-lg h-20 flex p-3">
        <div className="flex gap-x-4">
          <img
            class="w-10 h-10 rounded-full"
            src={selectedConversation?.participants?.[0].profilePic}
            alt="Rounded avatar"
          />
          <div className="flex flex-col justify-between ">
            <p className="text-lg font-semibold">
              {selectedConversation?.participants?.[0].name}
            </p>
            <p className="text-sm text-gray2 font-semibold">
              {isUserOnline(selectedConversation?.participants?.[0]._id)
                ? "online"
                : "offline"}
            </p>
          </div>
        </div>
      </div>

      <div class="border h-[85.50vh] ">
        <div
          class="flex-grow  overflow-y-auto h-full px-8 pt-8 text-left text-gray-700"
          ref={messagesRef}
        >
          {loading ? (
            <MessagesSkeleton />
          ) : messages ? (
            messages?.map((message) => (
              <div class="relative mb-6 text-left">
                <div class="text-gray-700">
                  <div
                    class={`relative  mr-8 sm:mr-16 inline-block rounded-md ${
                      user._id === message.sender
                        ? "bg-blue-700 float-right text-white"
                        : "bg-gray-200 float-left text-black"
                    } py-3 px-4`}
                  >
                    <p className="text-sm flex gap-x-1 ">
                      {message.text} {/* show only with send messages  */}
                      {message.sender !== receipientId && (
                        <IoCheckmarkDoneOutline
                          className={`text-lg ${
                            message.seen && "text-green-400"
                          }`}
                        />
                      )}
                    </p>
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
