import Results from "./Results";
import { Player } from "@/app/hooks/useMultiplayer";

type GameOverProps = {
  results: { target: number; winner: string | null } | null;
  players: Player[];
  isSpectator?: boolean;
};

export default function GameOver({ results, players, isSpectator }: GameOverProps) {
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-5xl font-bold mb-4"> {isSpectator ? 'Game Ended' : 'Game Over'}</h1>
      <p className="text-xl">You have been eliminated. Watch the game progress below:</p>
      {results && (
        <div className="mt-4">
          <Results target={results.target} winner={results.winner} />
          <h3 className="text-xl mt-4">Player Status:</h3>
          <ul>
            {players.map((player) => (
              <li
                key={player.id}
                className={`mt-2 ${player.alive ? "text-white" : "text-red-500"}`}
              >
                {player.name} - Points: {player.points}{" "}
                {player.alive ? "" : "(Eliminated)"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
