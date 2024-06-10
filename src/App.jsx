import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { io } from "socket.io-client";
import "./index.css";

const socket = io("https://chess-game-server-1.onrender.com");

const App = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("userrole", ({ role }) => {
      setCurrentPlayer(role);
      updateStatus();
    });

    socket.on("waitingForOpponent", ({ message }) => {
      setStatus(message);
    });

    socket.on("move", (move) => {
      game.move(move);
      setFen(game.fen());
      updateStatus();
    });

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("userrole");
      socket.off("waitingForOpponent");
      socket.off("move");
      socket.off("chatMessage");
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

  const sendMessage = () => {
    if (message) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
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
      <div id="chat">
        <div id="chatMessages">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          id="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button id="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
