import React from "react";
import "../index.css";

const PromotionModal = ({ show, onSelect, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="absolute w-[450px] h-[40vh] bg-green-500 top-0 translate-y-[50%] z-[100] rounded-md flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-[1.2em]">Select Promotion Piece</h2>
        <div className="flex flex-col gap-2">
          <button
            className="bg-white text-black w-[10vw]"
            onClick={() => onSelect("q")}
          >
            Queen
          </button>
          <button
            className="bg-white text-black w-[10vw]"
            onClick={() => onSelect("r")}
          >
            Rook
          </button>
          <button
            className="bg-white text-black w-[10vw]"
            onClick={() => onSelect("b")}
          >
            Bishop
          </button>
          <button
            className="bg-white text-black w-[10vw]"
            onClick={() => onSelect("n")}
          >
            Knight
          </button>
        </div>
        <button className="bg-black text-white px-2 py-1 rounded-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PromotionModal;
