'use client';
import { Player } from "@/app/types/game";

export default function PlayerCard({ 
  player,
  isCurrent,
  result,
  className,
  compact = false
}: { 
  player: Player;
  isCurrent: boolean;
  result?: 'win' | 'lose' | null;
  className?: string;
  compact?: boolean;
}) {
  // Explicit selection display for transition screens
  const showSelection = player.currentSelection !== null && !compact;

  if (compact) {
    return (
      <div className={`flex items-center bg-gray-700/30 rounded-lg p-2 gap-3 ${className}`}>
        {/* Compact layout */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <img
            src={player.image}
            alt={player.name}
            className={`w-full h-full object-cover rounded-lg border-2 ${
              result === 'win' ? 'border-green-500' :
              result === 'lose' ? 'border-red-500' : 'border-gray-600'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/avatars/default-avatar.png';
            }}
          />
          {isCurrent && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-xs px-1.5 py-0.5 text-white rounded-full shadow-md">
              YOU
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm truncate">{player.name}</h3>
          <div className={`text-sm font-mono px-2 py-1 rounded ${
            result === 'win' ? 'bg-green-900/50 text-green-300' :
            result === 'lose' ? 'bg-red-900/50 text-red-300' : 'bg-gray-800 text-gray-200'
          }`}>
            {player.currentSelection ?? '--'}
          </div>
          <span className="text-xs text-gray-400">Points: {player.points}</span>
        </div>
      </div>
    );
  }

  // Full-size version for StageTransition
  return (
    <div className={`flex flex-col items-center bg-gray-700/30 rounded-lg shadow-lg p-4 ${className}`}>
      {/* Player Image */}
      <div className="relative w-full h-[850px] mb-4 overflow-hidden">
        <img
          src={player.image}
          alt={player.name}
          className={`w-full h-full object-cover rounded-lg border-2 ${
            result === 'win' ? 'border-green-500' :
            result === 'lose' ? 'border-red-500' : 'border-gray-600'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/avatars/default-avatar.png';
          }}
        />
        {isCurrent && (
          <span className="absolute bottom-2 right-2 bg-blue-500 text-xs px-3 py-1 text-white rounded-full shadow-md">
            YOU
          </span>
        )}
      </div>

      {/* Player Name */}
      <h3 className="font-medium text-xl text-center mb-2">{player.name}</h3>

      {/* Explicit Selection Display */}
      <div className="flex flex-col items-center gap-2">
        {showSelection && (
          <span className={`text-2xl font-mono px-4 py-2 rounded ${
            result === 'win' ? 'bg-green-900/50 text-green-300' :
            result === 'lose' ? 'bg-red-900/50 text-red-300' : 'bg-gray-800 text-gray-200'
          }`}>
            Selected: {player.currentSelection}
          </span>
        )}
        <span className="text-lg text-gray-400">
          Points: {player.points}
        </span>
      </div>
    </div>
  );
}
