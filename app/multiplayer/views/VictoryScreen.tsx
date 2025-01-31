// VictoryScreen.tsx
'use client';
import { Player } from "@/app/types/game";
import { useState } from "react";
import PlayerCard from "@/app/multiplayer/components/PlayerCard";

type VictoryScreenProps = {
  winner: string;
  players: Player[];
  onLeave: () => void;
  currentPlayerName: string;
};

export default function VictoryScreen({ 
  winner, 
  players, 
  onLeave, 
  currentPlayerName 
}: VictoryScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = () => {
    if (window.confirm('Return to room list?')) {
      setIsLeaving(true);
      onLeave();
    }
  };

  const getPlayerStatus = (player: Player) => {
    if (player.name === winner) return 'game-winner';
    if (!player.alive) return 'game-loser';
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-purple-400 mb-4 animate-pulse">
          🏆 VICTORY 🏆
        </h1>
        <div className="bg-purple-900/30 p-6 rounded-xl">
          <h2 className="text-3xl font-semibold">
            Congratulations, <span className="text-yellow-400">{winner}</span>!
          </h2>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-gray-800/50 rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Final Standings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {players
            .sort((a, b) => b.points - a.points)
            .map((player) => (
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

        <div className="pt-6 border-t border-gray-700/50 text-center">
          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLeaving ? 'Returning to Lobby...' : 'Return to Room List'}
          </button>
        </div>
      </div>
    </div>
  );
}