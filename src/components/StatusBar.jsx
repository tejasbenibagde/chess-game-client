// components/Status.jsx
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const StatusBar = ({ status, fen, pgn }) => {
  const { width } = useWindowDimensions();

  // Split PGN string into individual moves
  const moves = pgn.split(" ");

  // Group moves into pairs
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 3) {
    movePairs.push(moves.slice(i, i + 3));
  }
  // 

  return (
    <div className="relative h-full mt-2 flex justify-start md:flex-col w-full md:w-[98%] gap-2">
      {width >= 786 &&
        <div id="status" className="w-full bg-primary rounded-sm px-2">
          {status}
        </div>
      }
      <div className={`w-full ${width >= 768 && 'custom-scrollbar'} flex md:flex-col overflow-y-hidden overflow-x-scroll md:overflow-y-scroll md:overflow-x-hidden h-[80%]`}>
        {movePairs.map((pair, index) => (
          <div
            key={index}
            className={`flex justify-start gap-2 sm:justify-between ${pair[0] % 2 === 0 ? "md:bg-secondary" : "md:bg-background"
              }`}
          >
            <span className="px-2 py-1 w-auto md:w-1/12">{pair[0]}</span>
            <span className="px-2 py-1 w-auto text-nowrap md:w-1/2 text-center">{pair[1]}</span>
            <span className="px-2 py-1 w-auto text-nowrap md:w-1/2 text-center">{pair[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;

{
  /* <div id="fen" className="bg-secondary rounded-sm px-2 overflow-scroll md:overflow-auto md:text-wrap">
        {fen}
      </div> */
}
