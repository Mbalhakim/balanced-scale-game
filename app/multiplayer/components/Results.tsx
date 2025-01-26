type ResultsProps = {
  target: number;
  winner: string | null;
};

const Results: React.FC<ResultsProps> = ({ target, winner }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4">Round Results</h3>
      <p className="text-xl">
        Target: <span className="font-mono">{target.toFixed(2)}</span>
      </p>
      {winner && (
        <p className="text-xl mt-2">
          Winner: <span className="text-green-400">{winner}</span>
        </p>
      )}
    </div>
  );
};

export default Results;
