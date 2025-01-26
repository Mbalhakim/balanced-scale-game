// components/PlayerCard.tsx
'use client';
import { Player } from "@/app/types/game";

export default function PlayerCard({ 
  player,
  isCurrent,
  result,
  className
}: { 
  player: Player;
  isCurrent: boolean;
  result?: 'win' | 'lose' | null;
  className?: string;
}) {
  return (
    <div 
      className={`flex flex-col items-center bg-gray-700/30 rounded-lg shadow-lg ${className}`}
    >
      {/* Player Image */}
      <div className="relative w-full h-[60%] mb-4  overflow-hidden">
        <img
          src={player.image}
          alt={player.name}
          className={`w-full h-full object-cover border-2 ${
            result === 'win' ? 'border-green-500' : 
            result === 'lose' ? 'border-red-500' : 'border-gray-600'
          }`}
          onError={(e) => {
            // Fallback if image fails to load
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

      {/* Selection and Points */}
      <div className="flex flex-col items-center">
        <span 
          className={`text-2xl font-mono px-4 py-2 rounded ${
            result === 'win' ? 'bg-green-900/50 text-green-300' :
            result === 'lose' ? 'bg-red-900/50 text-red-300' : 'bg-gray-800 text-gray-200'
          }`}
        >
          {player.currentSelection ?? '--'}
        </span>
        <span className="text-lg text-gray-400 mt-4">
          Points: {player.points}
        </span>
      </div>
    </div>
  );
}
