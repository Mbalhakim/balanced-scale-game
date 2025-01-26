// StageTransition.tsx
"use client";
import { Player } from "@/app/types/game";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

export default function StageTransition({
  stage,
  results,
  players = [],
  currentPlayer,
}: {
  stage: number;
  results: { target: number; winner: string };
  players?: Player[];
  currentPlayer?: Player;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      {/* Victory Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-green-400 mb-2">🎉 WIN</h1>
        <p className="text-2xl text-gray-300">Stage {stage} Complete!</p>
      </div>

      {/* Player Cards Grid - Updated */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {players?.map((player) => (
          <div
            key={player.id}
            className="w-full min-w-[240px] max-w-[300px] mx-auto"
          >
            <PlayerCard
              player={player}
              isCurrent={player.id === currentPlayer?.id}
              result={
                player.name === results.winner
                  ? "win"
                  : !player.alive
                  ? "lose"
                  : null
              }
            />
          </div>
        ))}
      </div>

      {/* Target Number Display */}
      <div className="bg-green-900/30 p-6 rounded-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">TARGET</h2>
        <p className="text-4xl font-mono text-green-400">
          {results.target.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
