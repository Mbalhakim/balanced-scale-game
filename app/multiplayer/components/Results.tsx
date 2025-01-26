type ResultsProps = {
  target: number;
  winner: string | null;
};

const Results: React.FC<ResultsProps> = ({ target, winner }) => {
  return (
    <div className="mt-4">
      <p>Target (Average * 0.8): {target.toFixed(2)}</p>
      <p>Winner: {winner}</p>
    </div>
  );
};

export default Results;
