import React from "react";
import "../index.css";
import useWindowDimensions from "../hooks/useWindowDimensions";

const PromotionModal = ({ show, onSelect, onClose }) => {
  if (!show) {
    return null;
  }
  const { width } = useWindowDimensions();

  return (
    <div
      className={`absolute md:w-[450px] h-auto py-2 top-16 bg-green-500 z-[100] rounded-md flex items-center justify-center`}
      style={{ width: width <= 650 ? width - width * 0.1 : 450 }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-[1.2em]">Select Promotion Piece</h2>
        <div className="flex flex-col gap-2">
          <button
            className="bg-white text-black p-2"
            onClick={() => onSelect("q")}
          >
            Queen
          </button>
          <button
            className="bg-white text-black p-2"
            onClick={() => onSelect("r")}
          >
            Rook
          </button>
          <button
            className="bg-white text-black p-2"
            onClick={() => onSelect("b")}
          >
            Bishop
          </button>
          <button
            className="bg-white text-black p-2"
            onClick={() => onSelect("n")}
          >
            Knight
          </button>
        </div>
        <button
          className="bg-black text-white px-2 py-1 rounded-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PromotionModal;
