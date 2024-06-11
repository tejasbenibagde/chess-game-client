// services/game.js
import { Chess } from "chess.js";

const game = new Chess();

export const getGameInstance = () => game;

export const makeMove = (move) => {
  return game.move(move);
};

export const getStatus = () => {
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

  return status;
};
