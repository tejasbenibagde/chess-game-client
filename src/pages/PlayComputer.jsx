import React, { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";

const PlayComputer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [playerRole, setPlayerRole] = useState(""); // State to store player role

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

  const startGame = (selectedRole) => {
    setPlayerRole(selectedRole);
    if (selectedRole === "black") {
      makeComputerMove();
    }
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
      makeComputerMove();
    } catch (error) {
      console.error(error.message);
      return "snapback";
    }
  };

  const makeComputerMove = () => {
    setTimeout(() => {
      const possibleMoves = game.moves();
      if (possibleMoves.length === 0) return;

      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      game.move(randomMove);
      setFen(game.fen());
      updateStatus();
    }, 500);
  };

  return (
    <div className="w-full min-h-[90vh] flex items-center justify-center flex-col">
      {playerRole ? (
        <>
          <ChessBoard
            position={fen}
            width={450}
            onDrop={onDrop}
            orientation={playerRole === "black" ? "black" : "white"}
          />
          <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
        </>
      ) : (
        <div className="bg-green-500 h-[15vw] w-[20vw] rounded-xl flex items-center justify-center flex-col gap-2">
          <h2 className="text-[1.2em]">Select Your Role</h2>
          <button className="text-[1em] bg-white text-black w-[10vw] py-2 rounded-md" onClick={() => startGame("white")}>Play as White</button>
          <button className="text-[1em] bg-black w-[10vw] py-2 rounded-md" onClick={() => startGame("black")}>Play as Black</button>
        </div>
      )}
    </div>
  );
};

export default PlayComputer;
