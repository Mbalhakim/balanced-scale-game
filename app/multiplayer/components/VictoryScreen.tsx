'use client';
import { Player } from "@/app/types/game";
import { useState } from "react";
export default function VictoryScreen({ winner, players, onLeave }: { 
  winner: string,
  players: Player[],
  onLeave: () => void;

  
})
 {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = () => {
    if (window.confirm('Return to room list?')) {
      setIsLeaving(true);
      onLeave();
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-900/50 text-white p-6">
      <h1 className="text-5xl font-bold mb-4">🏆 Victory! 🏆</h1>
      <div className="text-2xl mb-8">
        Congratulations, {winner}!
      </div>
      
      <div className="w-full max-w-2xl bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Final Standings</h2>
        <div className="space-y-3">
          {players.sort((a, b) => b.points - a.points).map((player) => (
            <div 
              key={player.id}
              className={`p-4 rounded-lg flex justify-between items-center ${
                player.name === winner 
                  ? 'bg-emerald-700/30' 
                  : 'bg-gray-700/30'
              }`}
            >
              <span>{player.name}</span>
              <span className="font-mono">{player.points} points</span>
            </div>
          ))}
        </div>
         {/* Add leave button */}
         <button
          onClick={handleLeave}
          disabled={isLeaving}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLeaving ? 'Leaving...' : 'Return to Room List'}
        </button>
      </div>
    </div>
  );
}