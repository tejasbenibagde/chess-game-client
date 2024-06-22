import React, { useEffect, useState, useRef } from "react";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";
import ChatBox from "../components/ChatBox";
import PromotionModal from "../components/PromotionModal";
import { connectSocket, disconnectSocket } from "../services/socket";
import { getGameInstance, makeMove, getStatus } from "../services/game";
import "../index.css";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { CiSquareAlert as AlertIcon } from "react-icons/ci";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";

const OnlinePlay = () => {
  const game = getGameInstance();
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [promotionMove, setPromotionMove] = useState(null);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const errorTimerRef = useRef(null);
  const [showDrawOfferDialog, setShowDrawOfferDialog] = useState(false);
  const [drawOfferMessage, setDrawOfferMessage] = useState("");
  const [drawOfferFromOpponent, setDrawOfferFromOpponent] = useState("");
  const [showDrawAcceptedDialog, setShowDrawAcceptedDialog] = useState(false);
  const [drawAcceptedMessage, setDrawAcceptedMessage] = useState("");
  const [showResignDialog, setShowResignDialog] = useState(false);

  const { width } = useWindowDimensions();
  
  useEffect(() => {
    const socket = connectSocket();

    socket.on("userrole", ({ role }) => {
      // console.log("User role set:", role);
      setCurrentPlayer(role);
      setStatus(getStatus());
      setWaitingForOpponent(false);
    });

    socket.on("waitingForOpponent", ({ message }) => {
      // console.log("Waiting for opponent:", message);
      setStatus(message);
      setWaitingForOpponent(true);
    });

    socket.on("move", (move) => {
      makeMove(move);
      setFen(game.fen());
      setStatus(getStatus());
      setWaitingForOpponent(false);
    });

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("error", (error) => {
      setErrorMessage(error.message);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    });

    socket.on("gameOver", ({ winner, draw }) => {
      if (draw) {
        setGameOverMessage("Game over, draw accepted.");
      } else {
        // console.log("Winner is", winner);
        // console.log("Current player is", currentPlayer);
        const result =
          winner === currentPlayer
            ? "You won! your opponent resigned"
            : "You lost! by resignation";
        setGameOverMessage(`Game over, ${result}`);
      }
      setShowGameOverDialog(true);
    });

    socket.on("offerDraw", ({ opponentRole }) => {
      const message = `Your opponent (${
        opponentRole === "w" ? "White" : "Black"
      }) offered a draw. Accept or Decline?`;
      setDrawOfferMessage(message);
      setDrawOfferFromOpponent(opponentRole);
      setShowDrawOfferDialog(true);
    });

    socket.on("drawDeclined", () => {
      setShowDrawOfferDialog(false);
      setDrawOfferFromOpponent("");
    });

    socket.on("drawAccepted", ({ draw }) => {
      setDrawAcceptedMessage("Draw accepted. The game is a draw.");
      setShowDrawAcceptedDialog(true);
    });

    socket.on("resign", ({ role }) => {
      // console.log(`Player ${role} resigned`);
    });

    return () => {
      disconnectSocket();
      if (errorTimerRef.current) {
        socket.off("offerDraw");
        socket.off("drawDeclined");
        socket.off("drawAccepted");
        socket.off("gameOver");
        socket.off("chatMessage");
        socket.off("move");
        socket.off("waitingForOpponent");
        socket.off("userrole");
        clearTimeout(errorTimerRef.current);
      }
      // Reset fen and pgn to starting positions
      game.reset();
      setFen(game.fen()); // set to starting fen position
      setStatus(getStatus()); // optionally reset status if needed
    };
  }, [game, currentPlayer]);

  useEffect(() => {
    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "Black" : "White";
      setGameOverMessage(`Game over, ${winner} wins by checkmate.`);
      setShowGameOverDialog(true);
    } else if (game.isDraw()) {
      setGameOverMessage("Game over, it's a draw.");
      setShowGameOverDialog(true);
    }
  }, [status, game]);

  const handlePromotionSelect = (promotion) => {
    const move = {
      ...promotionMove,
      promotion,
    };

    makeMove(move);
    setFen(game.fen());
    setStatus(getStatus());

    const socket = connectSocket();
    socket.emit("move", move);

    setPromotionSquare(null);
    setPromotionMove(null);
  };

  const handlePromotionClose = () => {
    setPromotionSquare(null);
    setPromotionMove(null);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      const formattedMessage = `${message} - ${
        currentPlayer === "w" ? "White" : "Black"
      }`;
      const socket = connectSocket();

      // Add the message to the local state immediately
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);

      socket.emit("chatMessage", formattedMessage);
      setMessage("");
    }
  };

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

      if (
        (piece === "wP" && targetSquare[1] === "8") ||
        (piece === "bP" && targetSquare[1] === "1")
      ) {
        setPromotionSquare(targetSquare);
        setPromotionMove({
          from: sourceSquare,
          to: targetSquare,
        });
        return;
      }

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) {
        throw new Error("Invalid move");
      }

      setFen(game.fen());
      const socket = connectSocket();
      socket.emit("move", move);
      setStatus(getStatus());
    } catch (error) {
      setErrorMessage(error.message);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return "snapback";
    }
  };

  const handleOfferDraw = (e) => {
    e.preventDefault();
    const socket = connectSocket();
    socket.emit("offerDraw", currentPlayer);
  };

  const handleDrawAccept = (e) => {
    e.preventDefault();
    const socket = connectSocket();
    socket.emit("drawAccept", currentPlayer);
    // console.log("accepted");
    setShowDrawOfferDialog(false);
  };

  const handleDrawDecline = (e) => {
    e.preventDefault();
    const socket = connectSocket();
    socket.emit("drawDecline");
    // console.log("declined");
    setShowDrawOfferDialog(false);
  };

  const handleResign = (e) => {
    e.preventDefault();
    setShowResignDialog(true);
  };

  const confirmResign = () => {
    const socket = connectSocket();
    // console.log("Current player resigning:", currentPlayer);
    socket.emit("resign", currentPlayer);
    setShowResignDialog(false);
  };

  const cancelResign = () => {
    setShowResignDialog(false);
  };

  // console.log(showDrawAcceptedDialog);

  return (
    <div className="relative w-full flex flex-col items-center h-[95vh] p-2">
      {errorMessage && (
        <Alert status="error" className="mb-4 flex items-center gap-4">
          <div>
            <AlertIcon size={30} color="primary" />
          </div>
          {errorMessage}
        </Alert>
      )}
      <div className="relative items-center justify-between flex flex-col md:flex-row w-full">
        <div className="flex flex-col items-center justify-center w-full md:w-2/3">
          <div className=" w-full flex justify-end py-2">
            <Badge>
              You are playing as {currentPlayer === "w" ? "white" : "black"}
            </Badge>
          </div>
          <AlertBox
            header={true}
            open={showGameOverDialog}
            onOpenChange={setShowGameOverDialog}
            title="Game Over"
            description={gameOverMessage}
            footer={true}
            footerAlertAction={[
              { onClick: () => setShowGameOverDialog(false), label: "close" },
            ]}
          />

          <PromotionModal
            show={promotionSquare !== null}
            onSelect={handlePromotionSelect}
            onClose={handlePromotionClose}
          />
          <ChessBoard
            width={width <= 640 ? width - 16 : 450}
            position={fen}
            onDrop={onDrop}
            orientation={currentPlayer === "w" ? "white" : "black"}
          />
          <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
        </div>
        <ChatBox
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          currentPlayer={currentPlayer}
          className="w-full md:w-1/3 mt-4 md:mt-0"
        />
        <div className="mt-4 flex space-x-4">
          <Button onClick={handleResign} variant="destructive">
            Resign
          </Button>
          <Button onClick={handleOfferDraw} variant="outline">
            Offer Draw
          </Button>
        </div>
        {waitingForOpponent && (
          <AlertBox
            header={true}
            open={waitingForOpponent}
            title="Waiting for opponent"
            description="Searching for an available opponent. This might take a few seconds."
          />
        )}
        {showDrawAcceptedDialog && (
          <AlertBox
            header={true}
            open={showDrawAcceptedDialog}
            onOpenChange={setShowDrawAcceptedDialog}
            title="Draw Accepted"
            description={drawAcceptedMessage}
            footer={true}
            footerAlertAction={[
              {
                onClick: setShowDrawAcceptedDialog(false),
                label: "Close",
              },
            ]}
          />
        )}
        {showDrawOfferDialog && drawOfferFromOpponent === currentPlayer && (
          <>
            <AlertBox
              header={true}
              open={showDrawOfferDialog}
              onOpenChange={setShowDrawOfferDialog}
              title="Draw Offer"
              description={drawOfferMessage}
              footer={true}
              footerAlertAction={[
                { onClick: handleDrawAccept, label: "Accept" },
                { onClick: handleDrawDecline, label: "Decline" },
              ]}
            />
          </>
        )}
        {showResignDialog && (
          <AlertBox
            header={true}
            open={showResignDialog}
            onOpenChange={setShowResignDialog}
            title="Confirm Resignation"
            description="Are you sure you want to resign?"
            footer={true}
            footerAlertAction={[
              { onClick: confirmResign, label: "Yes, Resign" },
              { onClick: cancelResign, label: "No, Cancel" },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default OnlinePlay;
