import React from "react";

const ChatBox = ({ messages, message, setMessage, sendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(e); // Pass the event object to the sendMessage function
  };

  return (
    <div id="chat" className="bg-zinc-600 w-[450px] rounded-sm p-2">
      <div id="chatMessages">
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
