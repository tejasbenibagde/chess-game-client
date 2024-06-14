// components/Status.jsx
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const StatusBar = ({ status, fen, pgn }) => {
  const { width } = useWindowDimensions();
  return (
    <div
      className={` md:px-0 mt-2 flex flex-col gap-2`}
      style={{ width: width <= 768 ? width-16 : 450 }}
    >
      <div id="status" className="w-full bg-primary rounded-sm px-2">
        {status}
      </div>
      <div id="fen" className="bg-secondary rounded-sm px-2 overflow-scroll md:overflow-auto md:text-wrap">
        {fen}
      </div>
      <div id="pgn" className="bg-secondary rounded-sm px-2 overflow-scroll text-nowrap md:overflow-auto md:text-wrap">
        {pgn}
      </div>
    </div>
  );
};

export default StatusBar;
