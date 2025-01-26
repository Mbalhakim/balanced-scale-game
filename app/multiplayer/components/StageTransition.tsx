'use client';
import { Player } from "@/app/types/game";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

export default function StageTransition({
  stage,
  aliveCount,
  results,
  currentPlayer,
  players = [] // Add default empty array
}: {
  stage: number;
  aliveCount: number;
  results: {
    target: number;
    winner: string;  // Ensure this matches the passed prop
  };
  players?: Player[]; // Make optional with ?
  currentPlayer?: Player;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Stage {stage} Complete!</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl mb-8">
        {players?.map(player => ( // Add optional chaining
          <PlayerCard
            key={player.id}
            player={player}
            isCurrent={player.id === currentPlayer?.id}
            result={
              player.name === results.winner ? 'win' :
              player.alive ? null : 'lose'
            }
          />
        ))}
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Round Results</h2>
        <p className="text-xl">
          Target Number: <span className="font-mono">{results.target.toFixed(2)}</span>
        </p>
        <p className="text-xl mt-2">
          Round Winner: <span className="text-green-400">{results.winner}</span>
        </p>
      </div>
    </div>
  );
}