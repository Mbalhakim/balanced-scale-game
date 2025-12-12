'use client';
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/app/types/game";

type NumberGridProps = {
  onSelect: (number: number) => void;
  selectedNumber: number | null;
  currentPlayer?: Player;
};

const NumberGrid: React.FC<NumberGridProps> = ({ 
  onSelect, 
  selectedNumber,
  currentPlayer 
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (num: number) => {
    if (!hasSubmitted) {
      onSelect(num);
      setHasSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl p-4">
      {/* Player Card - Top Section */}
      <div className="w-full mb-8 scale-110 origin-top">
        {currentPlayer && (
          <PlayerCard
            player={currentPlayer}
            isCurrent={true}
            className="w-full max-w-md mx-auto"
          />
        )}
      </div>

      {/* Number Grid - Bottom Section */}
      <div className="w-full">
        <div className="text-2xl font-bold mb-4 text-center">
          Selected Number: {selectedNumber !== null ? selectedNumber : "None"}
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5">
          {Array.from({ length: 101 }, (_, i) => i).map((num) => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              disabled={hasSubmitted || selectedNumber !== null}
              className={`text-sm p-1 rounded-md transition-colors
                ${selectedNumber === num 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300'}
                ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberGrid;