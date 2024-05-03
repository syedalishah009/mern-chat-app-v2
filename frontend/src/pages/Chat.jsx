import React, { useEffect, useState } from "react";
import LeftBar from "../components/LefBar/LeftBar";
import Messages from "../components/Messages/Messages";
import { IoChatboxOutline } from "react-icons/io5";
import { makeRequest } from "../utils/api";
import { useSocketContext } from "../context/SocketContext";

const Chat = () => {
  const [chatSelected, setChatSelected] = useState(null); // selected user store here
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useSocketContext();

  
  useEffect(() => {
    if (chatSelected) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const res = await makeRequest.get(
            `messages/all-messages/${chatSelected?._id}`
          );
          if (res?.data.success) {
            setMessages(res.data[0].messages);
            setLoading(false);
          } else {
            setMessages(null);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log("error while fetching messages", error);
        }
      };
      fetchMessages();
    }
  }, [chatSelected?._id]);
  return (
    <div className="flex">
      <LeftBar chatSelected={chatSelected} setChatSelected={setChatSelected} />
      {chatSelected || chatSelected !== null ? (
        <Messages
          messages={messages}
          loading={loading}
          chatSelected={chatSelected}
        />
      ) : (
        <div className="flex flex-col gap-y-2 justify-center w-full items-center">
          <p className="text-lg">Select any chat</p>
          <IoChatboxOutline className="text-[40px]" />
        </div>
      )}
    </div>
  );
};

export default Chat;
