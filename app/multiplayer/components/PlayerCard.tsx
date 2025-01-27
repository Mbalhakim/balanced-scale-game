// PlayerCard.tsx
'use client';
import { Player } from "@/app/types/game";

export default function PlayerCard({ 
  player,
  isCurrent,
  result,
  className,
}: { 
  player: Player;
  isCurrent: boolean;
  result?: 'win' | 'lose' | null;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center bg-gray-800/50 rounded-xl p-4 ${className}`}>
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full aspect-square mb-4 overflow-hidden">
        <img
    src={player.image ? player.image : '/images/avatars/eliminated.png'}
    alt={player.name}
    className={`w-full h-full object-cover rounded-lg border-4 ${
      result === 'win' ? 'border-green-500' :
      result === 'lose' ? 'border-red-500' : 'border-yellow-600'
    } ${!player.alive ? 'grayscale' : ''}`}
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

      {/* Player Info */}
      <div className="text-center w-full">
        <h3 className="font-medium text-lg mb-1 truncate">{player.name}</h3>
        <div className={`text-3xl font-bold my-2 ${
          result === 'win' ? 'text-green-400' :
          result === 'lose' ? 'text-red-400' : 'text-gray-200'
        }`}>
          {player.currentSelection ?? '--'}
        </div>
        <div className="text-sm text-gray-400">
          Points: {player.points}
        </div>
      </div>
    </div>
  );
}