import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && !socket) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: user._id,
        },
      });

      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, message];
          } else {
            // Handle the case when prev is not an array (e.g., initialize it as an empty array)
            return [message];
          }
        });
      });

     
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, messages, setMessages }}
    >
      {children}
    </SocketContext.Provider>
  );
};
