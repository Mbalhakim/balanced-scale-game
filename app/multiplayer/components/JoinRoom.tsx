'use client';
import { useState } from "react";
import { Room } from "@/app/types/game";

type JoinRoomProps = {
  onJoin: (name: string, room: string) => void;
  rooms: Room[];
};

export default function JoinRoom({ onJoin, rooms }: JoinRoomProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleJoin = () => {
    if (playerName.trim() && selectedRoom) {
      onJoin(playerName.trim(), selectedRoom);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Select Your Room
        </h1>
        <p className="text-gray-400 text-lg">Enter your name and choose a room to join</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your player name"
          className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="grid grid-cols-1 gap-3">
          {rooms.map((room) => (
            <button
              key={room.name}
              onClick={() => setSelectedRoom(room.name)}
              disabled={room.players >= room.maxPlayers || room.status !== 'lobby'}
              className={`p-4 text-left rounded-lg transition-all
                ${selectedRoom === room.name 
                  ? 'ring-2 ring-purple-400 bg-purple-500/20' 
                  : 'bg-gray-800 hover:bg-gray-700'}
                ${(room.players >= room.maxPlayers || room.status !== 'lobby') 
                  ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">{room.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {room.status === 'lobby' ? 'Waiting for players' : 'Game in progress'}
                  </p>
                </div>
                <span className="text-sm px-2 py-1 rounded bg-gray-700/50">
                  {room.players}/{room.maxPlayers}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleJoin}
          disabled={!playerName.trim() || !selectedRoom}
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}