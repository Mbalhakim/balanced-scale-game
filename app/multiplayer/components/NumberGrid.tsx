'use client';
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/app/types/game";

type NumberGridProps = {
  onSelect: (number: number) => void;
  selectedNumber: number | null;
  players: Player[];
  currentPlayer?: Player;
};

const NumberGrid: React.FC<NumberGridProps> = ({ 
  onSelect, 
  selectedNumber,
  players,
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
    <div className="flex flex-row gap-8 w-full max-w-6xl p-4">
      {/* Current Player Card - Left Side */}
      <div className="w-1/3 flex flex-col items-center">
        {currentPlayer && (
          <PlayerCard
            player={currentPlayer}
            isCurrent={true}
            className="sticky top-4"
          />
        )}
      </div>

      {/* Number Grid - Right Side */}
      <div className="w-2/3">
        <div className="text-2xl font-bold mb-4 text-center">
          Selected Number: {selectedNumber !== null ? selectedNumber : "None"}
        </div>

        <div className="grid grid-cols-8 gap-1.5">
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