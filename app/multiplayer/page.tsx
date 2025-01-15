'use client';

import { useState, useEffect } from "react";
import { initSocket, getSocket } from "@/app/util/socket";
import NumberGrid from "@/app/multiplayer/components/NumberGrid";
import PlayerList from "@/app/multiplayer/components/PlayerList";
import Results from "@/app/multiplayer/components/Results";
import RoomList from "@/app/multiplayer//components/RoomList";


type Player = {
  id: string;
  name: string;
  ready: boolean;
};

type Room = {
  name: string;
  players: number;
  maxPlayers: number;
};

export default function MultiplayerPage() {
  const [playerName, setPlayerName] = useState("");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberSelected, setNumberSelected] = useState(false);
  const [results, setResults] = useState<{ target: number; winner: string | null } | null>(null);
const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
const [otherSelections, setOtherSelections] = useState<{ playerName: string; number: number }[]>(
    []
);

  useEffect(() => {
    const socket = initSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001");

    if (socket) {
      socket.on("available-rooms", (rooms) => setAvailableRooms(rooms));
      socket.on("room-update", (data) => setPlayers(data.players));
      socket.on("start-game", () => setGameStarted(true));
      socket.on("number-selected", ({ playerName, number }) => {
        setOtherSelections((prev) => [...prev, { playerName, number }]); // Track other players' numbers
      });
      socket.on("player-selected", ({ playerName }) => {
        console.log(`${playerName} has selected a number.`);
      });
      socket.on("round-results", ({ target, winner }) => {
        setResults({ target, winner });
        setNumberSelected(false);
      });
      socket.on("error", (message) => alert(message));
    }
      

    return () => {
      getSocket()?.disconnect();
    };
  }, []);

  const handleJoin = () => {
    if (!playerName || !selectedRoom) {
      alert("Please enter your name and select a room!");
      return;
    }

    const socket = getSocket();
    if (socket) {
      socket.emit("join-room", { playerName, room: selectedRoom });
      setJoined(true);
    }
  };

  const selectNumber = (number: number) => {
    const socket = getSocket();
    if (socket && selectedRoom) {
      socket.emit("select-number", { room: selectedRoom, number });
      setSelectedNumber(number); // Update the selected number
      setNumberSelected(true);  // Lock selection until the round ends
    }
  };
  

  if (gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
        <h1 className="text-3xl font-bold">Game In Progress</h1>
        {results ? (
          <Results target={results.target} winner={results.winner} />
        ) : numberSelected ? (
          <div className="mt-4">
            <p>Waiting for other players to select...</p>
            <h3 className="text-xl mt-4">Numbers selected by other players:</h3>
            <ul className="mt-2">
              {otherSelections.map(({ playerName, number }, index) => (
                <li key={index} className="text-white">
                  {playerName} selected {number}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <NumberGrid onSelect={selectNumber} selectedNumber={selectedNumber} />
        )}
      </div>
    );
  }

  if (joined) {
    const toggleReady = () => {
      const socket = getSocket();
      if (socket && selectedRoom) {
        socket.emit("toggle-ready", { room: selectedRoom });
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
        <h2 className="text-2xl font-semibold">Welcome, {playerName}!</h2>
        <p className="mt-2">You are in room: <strong>{selectedRoom}</strong></p>
        <PlayerList
          players={players}
          currentPlayerName={playerName}
          onToggleReady={toggleReady}
        />
      </div>
    );
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <h1 className="text-3xl font-bold">Join a Room</h1>
      <div className="mt-4 flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="p-2 mb-4 text-gray-900 border border-gray-300 rounded"
        />
        <RoomList
          availableRooms={availableRooms}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
        />
        <button
          onClick={handleJoin}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
