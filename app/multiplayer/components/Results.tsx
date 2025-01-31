// Results.tsx
'use client';
import { Player } from "@/app/types/game";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

type ResultsProps = {
  target: number;
  roundWinner: string | null;
  roundLosers?: string[]; 
  players: Player[];
  currentPlayerName: string;
};

const Results: React.FC<ResultsProps> = ({ 
  target, 
  roundWinner, 
  roundLosers = [], 
  players = [], 
  currentPlayerName 
}) => {
  const getPlayerStatus = (player: Player) => {
    console.log(roundLosers)
    if (player.name === roundWinner) return 'round-winner';
    if (roundLosers.includes(player.name)) return 'round-loser';
    if (!player.alive) return 'game-loser';
    return null;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-purple-400 mb-2">🎯 ROUND RESULTS</h1>
        
        <div className="bg-purple-900/30 p-4 rounded-lg mt-4">
          <h2 className="text-2xl font-bold mb-2">Target Number</h2>
          <p className="text-4xl font-mono text-purple-400">
            {target.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mb-8">
        {players.map(player => (
          <div key={player.id} className="min-w-[240px]">
            <PlayerCard
              player={player}
              isCurrent={player.name === currentPlayerName}
              status={getPlayerStatus(player)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-green-900/30 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-green-400 mb-2">Round Winner</h3>
          <p className="text-lg">{roundWinner || 'No winner this round'}</p>
        </div>
        
        {roundLosers.length > 0 && (
          <div className="bg-red-900/30 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-red-400 mb-2">Round Losers</h3>
            <p className="text-lg">{roundLosers.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;