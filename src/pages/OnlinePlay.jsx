import React, { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";
import ChatBox from "../components/ChatBox";
import { connectSocket, disconnectSocket } from "../services/socket";
import { getGameInstance, makeMove, getStatus } from "../services/game";
import "../index.css";

const OnlinePlay = () => {
  const game = getGameInstance();
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = connectSocket();

    socket.on("userrole", ({ role }) => {
      setCurrentPlayer(role);
      setStatus(getStatus());
    });

    socket.on("waitingForOpponent", ({ message }) => {
      console.log("waiting", message);
      setStatus(message);
    });

    socket.on("move", (move) => {
      makeMove(move);
      setFen(game.fen());
      setStatus(getStatus());
    });

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      disconnectSocket();
    };
  }, [game]);

  const onDrop = ({ sourceSquare, targetSquare, piece }) => {
    try {
      if (
        (game.turn() === "w" && currentPlayer !== "w") ||
        (game.turn() === "b" && currentPlayer !== "b")
      ) {
        throw new Error("It's not your turn");
      }

      if (
        (currentPlayer === "w" && piece.startsWith("b")) ||
        (currentPlayer === "b" && piece.startsWith("w"))
      ) {
        throw new Error("You can only move your own pieces");
      }

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        throw new Error("Invalid move");
      }

      setFen(game.fen());
      const socket = connectSocket();
      socket.emit("move", move);
      setStatus(getStatus());
    } catch (error) {
      console.error(error.message);
      return "snapback";
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      const formattedMessage = `${message} - ${
        currentPlayer === "w" ? "White" : "Black"
      }`;
      const socket = connectSocket();
      socket.emit("chatMessage", formattedMessage);
      setMessage("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>
        <h1 className="bg-green-500 w-[10vw] my-2 rounded-sm flex items-center justify-center">
          {currentPlayer === "w" ? "White" : "Black"}
        </h1>
        <ChessBoard
          width={450}
          position={fen}
          onDrop={onDrop}
          orientation={currentPlayer === "w" ? "white" : "black"}
        />
        <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
        <ChatBox
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default OnlinePlay;
