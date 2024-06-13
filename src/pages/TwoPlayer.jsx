import React, { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";
import useWindowDimensions from "../hooks/useWindowDimensions";

const TwoPlayer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [orientation, setOrientation] = useState("white");

  const { width } = useWindowDimensions();

  const updateStatus = () => {
    let status = "";
    const moveColor = game.turn() === "b" ? "Black" : "White";

    if (game.isCheckmate()) {
      status = "Game over, " + moveColor + " is in checkmate.";
    } else if (game.isDraw()) {
      status = "Game over, drawn position";
    } else {
      status = moveColor + " to move";

      if (game.isCheck()) {
        status += ", " + moveColor + " is in check";
      }
    }

    setStatus(status);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        throw new Error("Invalid move");
      }

      setFen(game.fen());
      updateStatus();
    } catch (error) {
      //error
      console.error(error.message);
      return "snapback";
    }
  };

  return (
    <div className="w-full mt-2 flex flex-col items-center justify-center">
      <div
        className="px-[5vw] md:px-0 mb-2"
        style={{ width: width <= 768 ? width - width * 0.1 : 450 }}
      >
        <button
          onClick={() => {
            orientation === "white"
              ? setOrientation("black")
              : setOrientation("white");
          }}
          className="px-2 py-[1px] bg-green-500 rounded-sm"
        >
          Flip Board
        </button>
      </div>
      <ChessBoard
        position={fen}
        onDrop={onDrop}
        width={width <= 768 ? width - width * 0.1 : 450}
        orientation={orientation}
      />
      <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
    </div>
  );
};

export default TwoPlayer;
