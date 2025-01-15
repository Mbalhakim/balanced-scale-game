import { useEffect, useState } from "react";
import { initSocket, getSocket } from "@/app/util/socket";

export type Player = {
  id: string;
  name: string;
  ready: boolean;
  points: number;
  alive: boolean;
};

export type Room = {
  name: string;
  players: number;
  maxPlayers: number;
};

export const useMultiplayer = (playerName: string, selectedRoom: string) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberSelected, setNumberSelected] = useState(false);
  const [results, setResults] = useState<{ target: number; winner: string | null } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [otherSelections, setOtherSelections] = useState<{ playerName: string; number: number }[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [isAlive, setIsAlive] = useState(true);

  useEffect(() => {
    const socket = initSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001");

    if (socket) {
      socket.on("available-rooms", (rooms) => setAvailableRooms(rooms));
      socket.on("room-update", (data) => setPlayers(data.players));
      socket.on("start-game", () => setGameStarted(true));
      socket.on("stage-update", ({ stage }) => setCurrentStage(stage));
      socket.on("number-selected", ({ playerName, number }) => {
        setOtherSelections((prev) => [...prev, { playerName, number }]);
      });
      socket.on("round-results", ({ target, winner, players }) => {
        setResults({ target, winner });
        setPlayers(players);

        const currentPlayer = players.find((p) => p.name === playerName);
        if (currentPlayer && !currentPlayer.alive) {
          setIsAlive(false);
        }

        setNumberSelected(false);
      });
      socket.on("next-round", () => {
        if (!isAlive) return;
        setResults(null);
        setNumberSelected(false);
        setSelectedNumber(null);
        setOtherSelections([]);
      });
    }

    return () => {
      getSocket()?.disconnect();
    };
  }, [playerName, isAlive]);

  const handleJoinRoom = () => {
    const socket = getSocket();
    if (socket && playerName && selectedRoom) {
      socket.emit("join-room", { playerName, room: selectedRoom });
    }
  };

  const selectNumber = (number: number) => {
    const socket = getSocket();
    if (socket && selectedRoom) {
      socket.emit("select-number", { room: selectedRoom, number });
      setSelectedNumber(number);
      setNumberSelected(true);
    }
  };

  return {
    availableRooms,
    players,
    gameStarted,
    numberSelected,
    results,
    selectedNumber,
    otherSelections,
    currentStage,
    isAlive,
    handleJoinRoom,
    selectNumber,
  };
};
