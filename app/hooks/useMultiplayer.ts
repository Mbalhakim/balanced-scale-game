// app/hooks/useMultiplayer.ts
import { useEffect, useState } from "react";
import { initSocket, getSocket } from "@/app/util/socket";
import { GameState, Player, Room } from "@/app/types/game";

export const useMultiplayer = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'lobby',
    players: [],
    currentStage: 1,
    selectedNumber: null,
    results: null,
    rooms: [],
    selectedRoom: '',
    playerName: '',
    error: undefined
  });

  

  useEffect(() => {
    const socket = initSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001");

    const handleRoomUpdate = (players: Player[] = []) => {
      setGameState(prev => {
        if (!prev.playerName || !prev.selectedRoom) return prev;
    
        const currentPlayer = players.find(p => p.name === prev.playerName);
        const isEliminated = currentPlayer ? !currentPlayer.alive : false;
    
        return {
          ...prev,
          players,
          status: isEliminated ? 'eliminated' : prev.status
        };
      });
    };

    socket.on("available-rooms", (rooms: Room[]) => {
      setGameState(prev => ({ ...prev, rooms }));
    });

    // In useMultiplayer.ts, update the 'room-update' listener:
socket.on("room-update", (players: Player[]) => {
  setGameState(prev => {
    const currentPlayer = players.find(p => p.name === prev.playerName);
    const isEliminated = currentPlayer ? !currentPlayer.alive : false;
    
    // Preserve current status unless player is eliminated
    return {
      ...prev,
      players,
      status: isEliminated ? 'eliminated' : prev.status
    };
  });
});

    socket.on("spectate-mode", (data) => {
      setGameState(prev => ({
        ...prev,
        status: 'spectating',
        results: data,
        players: data.players
      }));
    });

    
    
    socket.on("game-over", ({ winner, players }) => {
      setGameState(prev => ({
        ...prev,
        status: 'game-over',
        players,
        results: { target: 0, winner }
      }));
    });
    

    socket.on("player-joined", (player: Player) => {
      setGameState(prev => ({
        ...prev,
        playerName: player.name,
        selectedRoom: prev.selectedRoom,
        players: prev.players.some(p => p.id === player.id) 
          ? prev.players 
          : [...prev.players, player],
        status: 'lobby'
      }));
    });

    socket.on("countdown-update", ({ countdown }: { countdown: number }) => {
      setGameState(prev => ({
        ...prev,
        countdown
      }));
    });

    socket.on("start-game", () => {
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        results: null,
        selectedNumber: null
      }));
    });
    socket.on("force-leave-room", () => {
      setGameState(prev => ({
        ...prev,
        selectedRoom: '',
        status: prev.status === 'game-over' ? 'game-over' : 'lobby'
      }));
    });

    socket.on("stage-update", ({ stage, players, aliveCount }) => {
      setGameState(prev => {
        const currentPlayer = players.find(p => p.name === prev.playerName);
        return {
          ...prev,
          currentStage: stage,
          players,
          // Keep existing results during stage transition
          status: currentPlayer?.alive ? 'stage-transition' : 'eliminated'
        };
      });
    });

    socket.on("number-selected", ({ playerName, number }) => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.name === playerName ? { ...p, currentSelection: number } : p
        )
      }));
    });

    socket.on("round-results", ({ target, winner, players, stage, aliveCount, status }) => {
      setGameState(prev => {
        const currentPlayer = players.find(p => p.name === prev.playerName);
        return {
          ...prev,
          results: { target, winner },
          players,
          currentStage: stage,
          status: currentPlayer?.alive ? status : 'eliminated'
        };
      });
    });

    // Modify the 'next-round' listener in useMultiplayer.ts
    // In useMultiplayer.ts, update the 'next-round' listener:
socket.on("next-round", () => {
  setGameState(prev => ({
    ...prev,
    results: null,
    selectedNumber: null,
    status: 'playing'
  }));
});

// Add to socket listeners in useMultiplayer.ts
socket.on("manual-leave", () => {
  leaveRoom();
});

socket.on("victory", ({ winner, players }) => {
  setGameState(prev => ({
    ...prev,
    status: prev.playerName === winner.name ? 'victory' : 'game-over',
    players,
    results: { winner: winner.name }
  }));
});

    socket.on("error", (message: string) => {
      setGameState(prev => ({ ...prev, error: message }));
    });

    return () => {
      socket.off("room-update", handleRoomUpdate);
      socket.off("player-joined");
      getSocket()?.disconnect();
    };
  }, []);

  const joinRoom = (playerName: string, roomName: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("join-room", { playerName, room: roomName });
      setGameState(prev => ({
        ...prev,
        playerName,
        selectedRoom: roomName,
        status: 'lobby'
      }));
    }
  };

  const toggleReady = () => {
    const socket = getSocket();
    if (socket && gameState.selectedRoom) {
      socket.emit("toggle-ready", { room: gameState.selectedRoom });
    }
  };

  const selectNumber = (number: number) => {
    const socket = getSocket();
    if (socket && gameState.selectedRoom) {
      socket.emit("select-number", { 
        room: gameState.selectedRoom, 
        number 
      });
      setGameState(prev => ({ ...prev, selectedNumber: number }));
    }
  };

// In useMultiplayer.ts - Modify leaveRoom function
const leaveRoom = () => {
  const socket = getSocket();
  if (socket) {
    socket.emit("leave-room");
    socket.disconnect();
  }
  
  // Reset local state
    // Reset all client state
    setGameState({
      status: 'lobby',
      players: [],
      currentStage: 1,
      selectedNumber: null,
      results: null,
      rooms: [],
      selectedRoom: '',
      playerName: '',
      error: undefined
    });
  };


  return {
    gameState,
    joinRoom,
    toggleReady,
    selectNumber,
    leaveRoom
  };
};
