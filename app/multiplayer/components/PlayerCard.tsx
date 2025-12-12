// PlayerCard.tsx
'use client';
import { Player } from "@/app/types/game";

export default function PlayerCard({ 
  player,
  isCurrent,
  status, // New status prop
  className,
}: { 
  player: Player;
  isCurrent: boolean;
  status?: 'game-winner' | 'round-winner' | 'game-loser' | 'round-loser' | 'spectating' | null;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center bg-gray-800/50 rounded-xl p-4 ${className}`}>
      {/* Status Badges */}
      <div className="absolute top-2 left-2 flex gap-1 z-10">
        {status === 'game-winner' && (
          <span className="bg-yellow-500 text-xs px-2 py-1 rounded-full">🏆 Champion</span>
        )}
        {status === 'round-winner' && (
          <span className="bg-green-500 text-xs px-2 py-1 rounded-full">⭐ Round Winner</span>
        )}
        {status === 'game-loser' && (
          <span className="bg-red-500 text-xs px-2 py-1 rounded-full">💀 Eliminated</span>
        )}
        {status === 'spectating' && (
          <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">👀 Spectating</span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square mb-4 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={player.image || '/images/avatars/default-avatar.png'}
          alt={player.name}
          className={`w-full h-full object-cover rounded-lg border-4 ${
            status === 'game-winner' ? 'border-yellow-500' :
            status === 'round-winner' ? 'border-green-500' :
            !player.alive ? 'border-red-500' : 'border-gray-600'
          } ${!player.alive ? 'grayscale' : ''}`}
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
          status === 'round-winner' ? 'text-green-400' :
          !player.alive ? 'text-red-400' : 'text-gray-200'
        }`}>
          {player.currentSelection ?? '--'}
        </div>
        <div className="text-sm text-gray-400">
          Points: {player.points} | {player.alive ? '❤️ Alive' : '💀 Eliminated'}
        </div>
      </div>
    </div>
  );
}