import React, { useState, useRef } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";
import { CiSquareAlert as AlertIcon } from "react-icons/ci";
import PromotionModal from "@/components/PromotionModal";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";

const PlayComputer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [promotionMove, setPromotionMove] = useState(null);
  const errorTimerRef = useRef(null);

  const { width, height } = useWindowDimensions();

  const updateStatus = () => {
    let status = "";
    const moveColor = game.turn() === "b" ? "Black" : "White";

    if (game.isCheckmate()) {
      status = "Game over, " + moveColor + " is in checkmate.";
      setGameOverMessage(status);
      setShowGameOverDialog(true);
    } else if (game.isDraw()) {
      status = "Game over, drawn position";
      setGameOverMessage(status);
      setShowGameOverDialog(true);
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

  const onDrop = ({ sourceSquare, targetSquare, piece }) => {
    try {
      if (
        (playerRole === "white" && piece.startsWith("b")) ||
        (playerRole === "black" && piece.startsWith("w"))
      ) {
        throw new Error("You can only move your own pieces");
      }

      const isPromotionMove =
        (piece === "wP" && targetSquare[1] === "8") ||
        (piece === "bP" && targetSquare[1] === "1");

      if (isPromotionMove) {
        setPromotionSquare(targetSquare);
        setPromotionMove({
          from: sourceSquare,
          to: targetSquare,
          promotion: null,
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
      updateStatus();
      makeComputerMove();
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

  const handlePromotionSelect = (promotion) => {
    try {
      const move = game.move({
        from: promotionMove.from,
        to: promotionMove.to,
        promotion,
      });

      if (move === null) {
        throw new Error("Invalid promotion move");
      }

      setFen(game.fen());
      updateStatus();
      makeComputerMove();

      setPromotionSquare(null);
      setPromotionMove(null);
    } catch (error) {
      setErrorMessage(error.message);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handlePromotionClose = () => {
    setPromotionSquare(null);
    setPromotionMove(null);
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
    <div className="relative w-full flex flex-col h-[95vh] p-2">
      <div>
        {errorMessage ? (
          <h1 className={`${cn(buttonVariants({ variant: "tertiary" }))} mb-2`}>
            <AlertIcon size={30} color="primary" />
            {errorMessage}
          </h1>
        ) : (
          <h1 className={`${cn(buttonVariants({ variant: "tertiary" }))} mb-2`}>
            You are playing as {playerRole === "white" ? "White" : "Black"}
          </h1>
        )}
      </div>
      <Separator />

      {!playerRole ? (
        <Card className={"bg-secondary"}>
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>Choose to play as White or Black</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => startGame("white")}>
              Play as White
            </Button>
            <Button variant="outline" onClick={() => startGame("black")}>
              Play as Black
            </Button>
          </CardFooter>
        </Card>
      ) : (
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
                orientation={playerRole === "black" ? "black" : "white"}
              />
            </div>
          </div>
          {
            width >= 786 ?
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
                      {/* Gonna Add something here in the future */}
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              ) : (
                <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
              )
          }
        </div>
      )}
    </div>
  );
};

export default PlayComputer;
