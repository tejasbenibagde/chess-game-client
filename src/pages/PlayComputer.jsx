import React, { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";

const PlayComputer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");

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

      // Computer move logic (random move for simplicity)
      setTimeout(() => {
        const possibleMoves = game.moves();
        if (possibleMoves.length === 0) return;

        const randomMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        game.move(randomMove);
        setFen(game.fen());
        updateStatus();
      }, 500);
    } catch (error) {
      console.error(error.message);
      return "snapback";
    }
  };

  return (
    <div>
      <ChessBoard fen={fen} onDrop={onDrop} orientation="white" />
      <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
    </div>
  );
};

export default PlayComputer;