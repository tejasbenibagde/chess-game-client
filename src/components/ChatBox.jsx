import React from "react";

import useWindowDimensions from "../hooks/useWindowDimensions";

const ChatBox = ({ messages, message, setMessage, sendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(e); 
  };

  const { width } = useWindowDimensions();

  return (
    <div
      id="chat"
      style={{
        width: width <= 768 ? width - width * 0.1 : 450,
        height: width > 768 && 500,
        maxHeight: width <= 768 && 500,
      }}
      className={`bg-zinc-600 rounded-sm p-2 px-[5vw] mt-2 lg:mt-10 lg:ml-2`}
    >
      <div
        id="chatMessages"
        className="overflow-scroll md:overflow-auto"
        style={{ height: width <= 768 ? "10vh" : "auto" }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-2 bg-full flex gap-2 items-center justify-end"
      >
        <input
          type="text"
          id="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-slate-500 py-1 px-2 rounded-sm"
        />
        <button type="submit" className="bg-green-500 py-1 px-2 rounded-sm">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
