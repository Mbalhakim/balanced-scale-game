// GameOver.tsx
import { useState } from 'react';
import { Player } from '@/app/types/game';
import PlayerCard from '@/app/multiplayer/components/PlayerCard';

export default function GameOver({
  results,
  players,
  onLeave
}: {
  results: { winner: string | null };
  players: Player[];
  onLeave: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const gameWinner = players.find(p => p.name === results.winner);
  const currentPlayer = players.find(p => p.name === localStorage.getItem('playerName'));

  const handleLeave = () => {
    setIsLeaving(true);
    onLeave();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center space-y-4 max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">🎖️ GAME FINAL RESULTS</h2>

        {gameWinner && (
          <div className="mb-8">
            <PlayerCard
              player={gameWinner}
              status="game-winner"
              isCurrent={gameWinner.name === currentPlayer?.name}
              className="max-w-md mx-auto"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {players
            .filter(p => p.name !== results.winner)
            .map(player => (
              <div key={player.id} className="min-w-[240px]">
                <PlayerCard
                  player={player}
                  status={player.alive ? null : 'game-loser'}
                  isCurrent={player.name === currentPlayer?.name}
                  className="w-full"
                />
              </div>
            ))}
        </div>

        <div className="mt-6">
          {currentPlayer?.name === results.winner ? (
            <p className="text-xl text-green-400 mb-4">Congratulations! You are the champion! 🏆</p>
          ) : (
            <p className="text-xl text-red-400 mb-4">Better luck next time! The winner was {results.winner}</p>
          )}
          
          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLeaving ? 'Returning to Lobby...' : 'Return to Lobby'}
          </button>
        </div>
      </div>
    </div>
  );
}