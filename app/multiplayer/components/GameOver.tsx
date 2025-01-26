// components/GameOver.tsx
import { useState } from 'react';
import { Player } from '@/app/types/game'; // Import Player type

export default function GameOver({
  results,
  players,
  onLeave
}: {
  results: { target: number; winner: string | null };
  players: Player[];
  onLeave: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = () => {
    setIsLeaving(true);
    onLeave(); // Socket handling should be in the parent component
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-4xl font-bold text-red-400">Game Over</h2>
        {results.winner && (
          <p className="text-xl">Winner: {results.winner}</p>
        )}
        
        <div className="mt-6 space-y-3">
          {players.map(player => (
            <div key={player.id} className={`p-3 rounded-lg ${
              player.alive ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              {player.name} - {player.alive ? 'Winner' : 'Eliminated'}
            </div>
          ))}
        </div>

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