// components/ChessBoard.jsx
import React from "react";
import Chessboard from "chessboardjsx";

const ChessBoard = ({ width, position, onDrop, orientation }) => {
  return (
    <Chessboard
      width={width}
      position={position}
      onDrop={onDrop}
      orientation={orientation}
    />
  );
};

export default ChessBoard;
