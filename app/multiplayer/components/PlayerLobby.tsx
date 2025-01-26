'use client';
import { Player } from "@/app/types/game";
import { useState } from "react";

type PlayerLobbyProps = {
  players: Player[];
  currentPlayerName: string;
  roomName: string;
  onToggleReady: () => void;
  countdown?: number;
};

export default function PlayerLobby({
  players,
  currentPlayerName,
  roomName,
  onToggleReady,
  countdown
}: PlayerLobbyProps) {
  const readyPlayers = players.filter((p) => p.ready).length;
  const allReady = players.length > 1 && players.every((p) => p.ready);
  const currentPlayer = players.find(p => p.name === currentPlayerName);
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onToggleReady();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Game Lobby
        </h1>
        <p className="text-gray-400 text-lg">Room: {roomName}</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Countdown display */}
        {countdown !== undefined && countdown > 0 && (
          <div className="text-center animate-pulse">
            <p className="text-2xl text-green-400 font-semibold">
              Starting in {countdown}
            </p>
          </div>
        )}

        {/* Players list */}
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className={`p-4 rounded-lg flex items-center justify-between transition-all
                ${player.name === currentPlayerName
                  ? 'bg-purple-500/20 ring-2 ring-purple-400'
                  : 'bg-gray-800'}
                ${player.ready ? 'opacity-100' : 'opacity-80'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full 
                  ${player.ready ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="font-medium text-white">
                  {player.name}
                  {player.name === currentPlayerName && (
                    <span className="ml-2 text-purple-300">(You)</span>
                  )}
                </span>
              </div>
              <span className={`text-sm ${player.ready ? 'text-green-400' : 'text-red-400'}`}>
                {player.ready ? 'Ready' : 'Waiting'}
              </span>
            </div>
          ))}
        </div>

        {/* Ready status */}
        <div className="text-center text-gray-400">
          {readyPlayers}/{players.length} players ready
        </div>

        {/* Ready button */}
        <button
          onClick={handleButtonClick}
          className={`w-full py-3 px-6 rounded-lg text-white transition-all transform
            ${
              currentPlayer?.ready 
                ? 'bg-green-600 hover:bg-green-700 cursor-default ring-2 ring-green-400'
                : 'bg-red-600 hover:bg-red-700 hover:scale-[1.02]'
            }
            ${isClicked ? 'scale-95' : ''}`}
          disabled={currentPlayer?.ready}
        >
          <div className="flex items-center justify-center space-x-2">
            {currentPlayer?.ready ? (
              <>
                <svg 
                  className="w-5 h-5 text-white animate-check-bounce"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span>Ready!</span>
              </>
            ) : (
              <span>Ready Up</span>
            )}
          </div>
        </button>

        {/* Status message */}
        <p className="text-center text-sm text-gray-500">
          {allReady ? 'Starting game...' : 'Minimum 2 players required to start'}
        </p>
      </div>

      <style jsx global>{`
        @keyframes check-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-check-bounce {
          animation: check-bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}