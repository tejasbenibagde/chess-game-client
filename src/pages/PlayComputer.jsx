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
import { Alert } from "@/components/ui/alert";
import PromotionModal from "@/components/PromotionModal"; // Import the PromotionModal component

const PlayComputer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [promotionSquare, setPromotionSquare] = useState(null); // State for promotion square
  const [promotionMove, setPromotionMove] = useState(null); // State for promotion move
  const errorTimerRef = useRef(null);

  const { width } = useWindowDimensions();

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
      // Ensure the player is only moving their own pieces
      if (
        (playerRole === "white" && piece.startsWith("b")) ||
        (playerRole === "black" && piece.startsWith("w"))
      ) {
        throw new Error("You can only move your own pieces");
      }

      // Check if the move is a promotion
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
        promotion: "q",
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
    const move = {
      ...promotionMove,
      promotion,
    };

    game.move(move);
    setFen(game.fen());
    updateStatus();
    makeComputerMove();

    setPromotionSquare(null);
    setPromotionMove(null);
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
    <div className="w-full min-h-[90vh] flex items-center justify-center flex-col">
      {errorMessage && (
        <Alert status="error" className="mb-4 flex items-center gap-4">
          <div>
            <AlertIcon size={30} color="primary" />
          </div>
          {errorMessage}
        </Alert>
      )}
      {playerRole ? (
        <>
          <ChessBoard
            position={fen}
            width={width <= 768 ? width - 16 : 450}
            onDrop={onDrop}
            orientation={playerRole === "black" ? "black" : "white"}
          />
          <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
        </>
      ) : (
        <Card className={"bg-secondary"}>
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>Card Description</CardDescription>
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
      )}
      {showGameOverDialog && (
        <AlertBox
          header={true}
          open={showGameOverDialog}
          onOpenChange={setShowGameOverDialog}
          title="Game Over"
          description={gameOverMessage}
          footer={true}
          footerAlertAction={[
            { onClick: () => setShowGameOverDialog(false), label: "Close" },
          ]}
        />
      )}
      {promotionSquare !== null && (
        <PromotionModal
          show={promotionSquare !== null}
          onSelect={handlePromotionSelect}
          onClose={handlePromotionClose}
        />
      )}
    </div>
  );
};

export default PlayComputer;
