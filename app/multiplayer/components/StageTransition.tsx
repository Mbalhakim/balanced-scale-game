'use client';
import { Player } from "@/app/types/game";

export default function StageTransition({ 
  stage, 
  aliveCount,
  results,
  currentPlayer
}: { 
  stage: number, 
  aliveCount: number,
  results: { target: number; winner: string | null } | null, // Allow null
  currentPlayer: Player | undefined
}) {
  // Add safe default values
  const safeResults = results || { target: 0, winner: null };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-4xl font-bold animate-pulse mb-8">
        Stage {stage} Starting...
      </h2>
      
      {/* Results Section */}
      <div className="bg-gray-700/50 rounded-xl p-6 w-full max-w-2xl">
        <h3 className="text-2xl font-bold mb-4 text-center">Previous Round Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-600 rounded-lg">
            <p className="text-sm text-gray-400">Target Number</p>
            <p className="text-3xl font-bold text-purple-400">
              {safeResults.target.toFixed(2)} {/* Use safeResults */}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-600 rounded-lg">
            <p className="text-sm text-gray-400">Round Winner</p>
            <p className="text-2xl font-bold text-green-400">
              {safeResults.winner || "No winner"} {/* Use safeResults */}
            </p>
          </div>
        </div>

        {/* Player Status */}
        {currentPlayer && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            currentPlayer.alive 
              ? 'bg-green-900/30' 
              : 'bg-red-900/30'
          }`}>
            <p className="text-lg">
              {currentPlayer.alive ? "🎉 You survived!" : "💀 You were eliminated"}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Total Points: {currentPlayer.points}
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-xl text-gray-400">
        {aliveCount} players advancing to next stage
      </p>
    </div>
  );
}