import React, { useEffect, useState } from "react";
import LeftBar from "../components/LefBar/LeftBar";
import Messages from "../components/Messages/Messages";
import { IoChatboxOutline } from "react-icons/io5";

const Chat = () => {
  const [conversations, setConversations] = useState();
  const [selectedConversation, setSelectedConversation] = useState(null);

  
  return (
    <div className="flex">
      <LeftBar
        conversations={conversations}
        setConversations={setConversations}
        selectedConversations={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
      {selectedConversation || selectedConversation !== null ? (
        <Messages
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          setConversations={setConversations}
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
