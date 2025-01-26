'use client';
import { Player } from "@/app/types/game";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

export default function StageTransition({
  stage,
  results,
  players = [],
  currentPlayer
}: {
  stage: number;
  results: { target: number; winner: string };
  players?: Player[];
  currentPlayer?: Player;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Stage {stage} Complete!</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl mb-8">
        {players?.map(player => {
          // Ensure selection is preserved
          const playerWithSelection = { 
            ...player,
            currentSelection: player.currentSelection // Force include selection
          };

          return (
            <PlayerCard
              key={player.id}
              player={playerWithSelection}
              isCurrent={player.id === currentPlayer?.id}
              result={
                player.name === results.winner ? 'win' :
                !player.alive ? 'lose' : null
              }
              className="w-full"
            />
          );
        })}
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
