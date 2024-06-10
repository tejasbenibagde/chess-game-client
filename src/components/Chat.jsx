// src/components/Chat.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Initialize the socket connection outside the component
const socket = io("https://chess-game-server-1.onrender.com");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Event listener for chat messages
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the event listener
    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div id="chat">
      <div id="chatMessages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        id="chatInput"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button id="sendButton" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;
