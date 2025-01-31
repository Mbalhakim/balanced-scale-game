// Spectator.tsx
'use client';
import { Player } from "@/app/types/game";
import Results from "@/app/multiplayer/components/Results";

type SpectatorProps = {
  players: Player[];
  results: {
    target: number;
    winner: string | null;
    losers: string[];
  } | null;
  currentPlayerName: string;
};

const Spectator: React.FC<SpectatorProps> = ({ 
  players, 
  results, 
  currentPlayerName 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">👀 Spectator Mode</h2>
      <div className="max-w-2xl w-full">
        {results && (
          <Results
            target={results.target}
            roundWinner={results.winner}
            roundLosers={results.losers}
            players={players}
            currentPlayerName={currentPlayerName}
          />
        )}
        <div className="mt-6 bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Player Status</h3>
          {players.map((player) => (
            <div
              key={player.id}
              className={`p-3 mb-2 rounded-lg ${
                player.alive ? "bg-green-900/30" : "bg-red-900/30"
              }`}
            >
              {player.name} - {player.alive ? "Alive" : "Eliminated"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spectator;