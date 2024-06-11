// components/Status.jsx
import React from "react";

const StatusBar = ({ status, fen, pgn }) => {
  return (
    <div className="w-[450px] mt-2 flex flex-col gap-2">
      <div id="status" className="w-full bg-green-500 rounded-sm px-2">{status}</div>
      <div id="fen" className="bg-zinc-600 rounded-sm px-2">{fen}</div>
      <div id="pgn" className="bg-zinc-600 rounded-sm px-2">{pgn}</div>
    </div>
  );
};

export default StatusBar;
