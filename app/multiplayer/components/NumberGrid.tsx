import { useState } from "react";
type NumberGridProps = {
  onSelect: (number: number) => void; // Callback for when a number is selected
  selectedNumber: number | null;     // The currently selected number
};

const NumberGrid: React.FC<NumberGridProps> = ({ onSelect, selectedNumber }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (num: number) => {
    if (!hasSubmitted) {
      onSelect(num);
      setHasSubmitted(true); // Prevent multiple submissions
    }
  };
  return (
    <div className="flex flex-col items-center">
      {/* Display the currently selected number */}
      <div className="text-4xl font-bold mb-4">
        Selected Number: {selectedNumber !== null ? selectedNumber : "None"}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 101 }, (_, i) => i).map((num) => (
          <button
          key={num}
          onClick={() => handleSelect(num)}
          disabled={hasSubmitted || selectedNumber !== null}
          className={`p-4 rounded-lg text-white transition-colors 
            ${selectedNumber === num ? 'bg-purple-600' : 'bg-gray-700'}
            ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
        >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGrid;