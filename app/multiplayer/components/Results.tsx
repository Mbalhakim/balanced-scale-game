// Results.tsx
'use client';
import { Player } from "@/app/types/game";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

type ResultsProps = {
  target: number;
  winner: string | null;
  players: Player[];
  currentPlayerName: string;
};

const Results: React.FC<ResultsProps> = ({ target, winner, players, currentPlayerName }) => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      {/* Results Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-purple-400 mb-2">🎯 RESULTS</h1>
        <p className="text-2xl text-gray-300">Round Summary</p>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-6xl mb-8">
        {players.map(player => (
          <div key={player.id} className="min-w-[240px]">
            <PlayerCard
              player={player}
              isCurrent={player.name === currentPlayerName}
              result={
                player.name === winner ? 'win' :
                !player.alive ? 'lose' : null
              }
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Target Number Display */}
      <div className="bg-purple-900/30 p-6 rounded-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">TARGET</h2>
        <p className="text-4xl font-mono text-purple-400">
          {target.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Results;