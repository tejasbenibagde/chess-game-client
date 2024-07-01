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
import { Button, buttonVariants } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/actions/userActions";
import { createGame } from "@/actions/gameActions";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


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

  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();
  const { userDetails, loading, error, token } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!userDetails && token) {
      dispatch(fetchUser(token));
    }
  }, [userDetails, token, dispatch]);

  useEffect(() => {
    if (loading) return;
    if (error) return;

    const socket = connectSocket();

    // Emit user ID when userDetails are available
    if (userDetails) {
      socket.emit("userConnected", { userId: userDetails.id });
    }

    socket.on("userrole", ({ role }) => {
      setCurrentPlayer(role);
      setStatus(getStatus());
      setWaitingForOpponent(false);
    });

    socket.on("waitingForOpponent", ({ message }) => {
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

    socket.on("gameOver", (data) => {
      const { winner, draw, white_player_id, black_player_id } = data;
      console.log(data);
      console.log(currentPlayer);
      let result;
      const pgn = game.pgn();
      const fen = game.fen();
      const white_rating = 1600;
      const black_rating = 1600;
      const rating_shift = 10;
      if (draw) {
        setGameOverMessage("Game over, draw accepted.");
      } else {
        result =
          winner === currentPlayer
            ? "You won! Your opponent Resigned"
            : "You lost! You Resigned";
        setGameOverMessage(result);
      }
      dispatch(createGame({
        white_player_id,
        black_player_id,
        result: draw ? "n" : winner === "w" ? "w" : "b",
        pgn,
        fen,
        white_rating,
        black_rating,
        rating_shift
      }))
      setShowGameOverDialog(true);
    });

    socket.on("offerDraw", ({ opponentRole }) => {
      const message = `Your opponent (${opponentRole === "w" ? "White" : "Black"}) offered a draw. Accept or Decline?`;
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
      // Handle resignation
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
      game.reset();
      setFen(game.fen());
      setStatus(getStatus());
    };
  }, [userDetails, loading, error, game, currentPlayer]);

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
      const formattedMessage = `${message} - ${currentPlayer === "w" ? "White" : "Black"
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
    <div className="relative w-full flex flex-col h-[95vh] p-2">
      <div>
        {errorMessage ? (
          <h1 className={`${cn(buttonVariants({ variant: "tertiary" }))} mb-2`}>
            <AlertIcon size={30} color="primary" />
            {errorMessage}
          </h1>
        ) : (
          <h1 className={`${cn(buttonVariants({ variant: "tertiary" }))} mb-2`}>
            You are playing as {currentPlayer === "w" ? "White" : "Black"}
          </h1>
        )}
      </div>
      <Separator />

      <div className="relative mt-2 flex flex-col-reverse md:flex-row gap-2">
        <div className="flex flex-col w-full md:w-2/3">
          <AlertBox
            header
            open={showGameOverDialog}
            onOpenChange={setShowGameOverDialog}
            title="Game Over"
            description={gameOverMessage}
            footer
            footerAlertAction={[
              { onClick: () => setShowGameOverDialog(false), label: "Close" },
            ]}
          />

          <PromotionModal
            show={promotionSquare !== null}
            onSelect={handlePromotionSelect}
            onClose={handlePromotionClose}
          />
          <div
            className="relative overflow-hidden rounded-md"
            style={{
              width: width <= 640 ? width - 16 : height - 120,
              height: width <= 640 ? width - 16 : height - 120,
            }}
          >
            <ChessBoard
              width={width <= 640 ? width - 16 : height - 120}
              position={fen}
              onDrop={onDrop}
              orientation={currentPlayer === "w" ? "white" : "black"}
            />
          </div>
          <div className="mt-4 flex justify-between">
            {width <= 786 &&
              <Drawer>
                <DrawerTrigger className={cn(buttonVariants({ variant: "secondary" }))}>Chat</DrawerTrigger>
                <DrawerContent className="px-2">
                  <DrawerTitle className="px-2">Chat</DrawerTitle>
                  <DrawerHeader className="h-[50vh] relative flex items-center justify-center">
                    <ChatBox
                      messages={messages}
                      message={message}
                      setMessage={setMessage}
                      sendMessage={sendMessage}
                      currentPlayer={currentPlayer}
                      className="w-full md:w-1/3 mt-4 md:mt-0"
                    />
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            }
            <div className="flex space-x-4">
              <Button onClick={handleResign} variant="destructive">
                Resign
              </Button>
              <Button onClick={handleOfferDraw} variant="outline">
                Offer Draw
              </Button>

            </div>
          </div>
        </div>
        {
          width >= 768 ?
            (
              <div className="w-full h-[80vh] flex flex-col">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    className="relative p-2 py-4 overflow-y-scroll custom-scrollbar"
                    minSize={35}
                    maxSize={55}
                  >
                    <div className="h-full">
                      <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel className="relative ">
                    <ChatBox
                      messages={messages}
                      message={message}
                      setMessage={setMessage}
                      sendMessage={sendMessage}
                      currentPlayer={currentPlayer}
                      className="w-full md:w-1/3 mt-4 md:mt-0"
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            ) : (
              <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
            )
        }

        {waitingForOpponent && (
          <AlertBox
            header
            open={waitingForOpponent}
            title="Waiting for Opponent"
            description="Searching for an available opponent. This might take a few seconds."
          />
        )}

        {showDrawAcceptedDialog && (
          <AlertBox
            header
            open={showDrawAcceptedDialog}
            onOpenChange={setShowDrawAcceptedDialog}
            title="Draw Accepted"
            description={drawAcceptedMessage}
            footer
            footerAlertAction={[
              {
                onClick: () => setShowDrawAcceptedDialog(false),
                label: "Close",
              },
            ]}
          />
        )}

        {showDrawOfferDialog && drawOfferFromOpponent === currentPlayer && (
          <AlertBox
            header
            open={showDrawOfferDialog}
            onOpenChange={setShowDrawOfferDialog}
            title="Draw Offer"
            description={drawOfferMessage}
            footer
            footerAlertAction={[
              { onClick: handleDrawAccept, label: "Accept" },
              { onClick: handleDrawDecline, label: "Decline" },
            ]}
          />
        )}

        {showResignDialog && (
          <AlertBox
            header
            open={showResignDialog}
            onOpenChange={setShowResignDialog}
            title="Confirm Resignation"
            description="Are you sure you want to resign?"
            footer
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
