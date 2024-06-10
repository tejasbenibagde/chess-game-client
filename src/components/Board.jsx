// src/components/Board.jsx
import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io } from "socket.io-client";

// Initialize the socket connection outside the component
const socket = io("https://chess-game-server-1.onrender.com");

const Board = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");

  useEffect(() => {
    // Event listener for user role
    socket.on("userrole", ({ role }) => {
      setCurrentPlayer(role);
      updateStatus();
    });

    // Event listener for waiting for opponent
    socket.on("waitingForOpponent", ({ message }) => {
      setStatus(message);
    });

    // Event listener for move
    socket.on("move", (move) => {
      game.move(move);
      setFen(game.fen());
      updateStatus();
    });

    // Clean up the event listeners
    return () => {
      socket.off("userrole");
      socket.off("waitingForOpponent");
      socket.off("move");
    };
  }, [game]);

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
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return "snapback";
    setFen(game.fen());
    socket.emit("move", move);
    updateStatus();
  };

  return (
    <div>
      <h1>{currentPlayer}</h1>
      <Chessboard
        width={400}
        position={fen}
        onDrop={onDrop}
        orientation={currentPlayer === "w" ? "white" : "black"}
      />
      <div id="status">{status}</div>
      <div id="fen">{game.fen()}</div>
      <div id="pgn">{game.pgn()}</div>
    </div>
  );
};

export default Board;
