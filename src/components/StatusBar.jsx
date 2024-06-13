// components/Status.jsx
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const StatusBar = ({ status, fen, pgn }) => {
  const { width } = useWindowDimensions();
  console.log("statuswidth", width);
  return (
    <div
      className={`px-[5vw] md:px-0 mt-2 flex flex-col gap-2`}
      style={{ width: width <= 768 ? width : 450 }}
    >
      <div id="status" className="w-full bg-green-500 rounded-sm px-2">
        {status}
      </div>
      <div id="fen" className="bg-zinc-600 rounded-sm px-2 overflow-scroll md:overflow-auto md:text-wrap">
        {fen}
      </div>
      <div id="pgn" className="bg-zinc-600 rounded-sm px-2 overflow-scroll text-nowrap md:overflow-auto md:text-wrap">
        {pgn}
      </div>
    </div>
  );
};

export default StatusBar;
