import React, { useState, useRef } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import StatusBar from "../components/StatusBar";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/AlertBox";
import { CiSquareAlert as AlertIcon } from "react-icons/ci";
import { Alert } from "@/components/ui/alert";
import PromotionModal from "@/components/PromotionModal"; // Import the PromotionModal component

const TwoPlayer = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [orientation, setOrientation] = useState("white");
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

  const onDrop = ({ sourceSquare, targetSquare, piece }) => {
    try {
      if (
        (game.turn() === "w" && piece.startsWith("b")) ||
        (game.turn() === "b" && piece.startsWith("w"))
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

    setPromotionSquare(null);
    setPromotionMove(null);
  };

  const handlePromotionClose = () => {
    setPromotionSquare(null);
    setPromotionMove(null);
  };

  return (
    <div className="w-full mt-2 flex flex-col items-center justify-center">
      {errorMessage && (
        <Alert status="error" className="mb-4 flex items-center gap-4">
          <div>
            <AlertIcon size={30} color="primary" />
          </div>
          {errorMessage}
        </Alert>
      )}
      <div className="w-full px-2 py-2 flex justify-end">
        <Button
          onClick={() => {
            orientation === "white"
              ? setOrientation("black")
              : setOrientation("white");
          }}
        >
          Flip Board
        </Button>
      </div>
      <ChessBoard
        position={fen}
        onDrop={onDrop}
        width={width <= 768 ? width - 16 : 450}
        orientation={orientation}
      />
      <StatusBar status={status} fen={game.fen()} pgn={game.pgn()} />
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

export default TwoPlayer;
