type NumberGridProps = {
  onSelect: (number: number) => void; // Callback for when a number is selected
  selectedNumber: number | null;     // The currently selected number
};

const NumberGrid: React.FC<NumberGridProps> = ({ onSelect, selectedNumber }) => {
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
            className={`px-4 py-2 rounded ${
              selectedNumber === num
                ? "bg-green-500 text-white" // Highlight the selected number
                : "bg-blue-500 text-white hover:bg-blue-400"
            }`}
            onClick={() => onSelect(num)} // Update the selection on click
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGrid;
