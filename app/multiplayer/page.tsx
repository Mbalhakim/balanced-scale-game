// app/multiplayer/page.tsx
'use client';
import { useEffect, useState } from "react";
import { useMultiplayer } from "@/app/hooks/useMultiplayer";
import GameOver from "@/app/multiplayer/components/GameOver";
import NumberGrid from "@/app/multiplayer/components/NumberGrid";
import PlayerLobby from "@/app/multiplayer/components/PlayerLobby";
import JoinRoom from "@/app/multiplayer/components/JoinRoom";
import Results from "@/app/multiplayer/components/Results";
import StageTransition from "./components/StageTransition";
import VictoryScreen from "./components/VictoryScreen";
export default function MultiplayerPage() {
  const { gameState, joinRoom, toggleReady, selectNumber, leaveRoom  } = useMultiplayer();
  const [localPlayers, setLocalPlayers] = useState<typeof gameState.players>([]);

  // Sync local players state with gameState
  useEffect(() => {
    setLocalPlayers(gameState.players);
  }, [gameState.players]);

  if (gameState.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-900/90 text-white p-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Connection Error</h2>
          <p className="text-xl text-red-200">{gameState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-white text-red-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }
    // Update existing game-over check
    if (gameState.status === 'game-over') {
      return <GameOver 
        results={gameState.results} 
        players={gameState.players} 
        onLeave={leaveRoom} // Add missing prop
      />;
    }

  if (!gameState.selectedRoom) {
    return (
      <JoinRoom 
        onJoin={joinRoom} 
        rooms={gameState.rooms} 
      />
    );
  }
  

  if (gameState.status === 'eliminated' || gameState.status === 'game-over') {
    return <GameOver 
      results={gameState.results} 
      players={gameState.players} 
      onLeave={leaveRoom} // Add this prop
    />;
  }

 // Modify the status check
 if (gameState.status === 'stage-transition') {
  return <StageTransition 
    stage={gameState.currentStage}
    aliveCount={gameState.players.filter(p => p.alive).length}
    results={gameState.results!}
    currentPlayer={gameState.players.find(p => p.name === gameState.playerName)}
  />;
}

  if (gameState.status === 'playing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Game Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-purple-400">
              Stage {gameState.currentStage}
            </h1>
            <p className="text-gray-400 text-lg">
              Room: <span className="font-mono">{gameState.selectedRoom}</span>
            </p>
          </div>

          {gameState.results ? (
            /* Results Screen */
            <div className="bg-gray-700/50 rounded-xl p-6 shadow-xl">
              <Results {...gameState.results} />
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Player Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localPlayers.map(player => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg ${
                        player.alive 
                          ? 'bg-green-900/30' 
                          : 'bg-red-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {player.name}
                          {player.name === gameState.playerName && (
                            <span className="ml-2 text-blue-400">(You)</span>
                          )}
                        </span>
                        <span className={`text-sm ${
                          player.alive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {player.alive ? `Points: ${player.points}` : 'Eliminated'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Game Screen */
            <div className="space-y-8">
              <NumberGrid 
                onSelect={selectNumber}
                selectedNumber={gameState.selectedNumber}
              />
              
              {/* Current Players */}
              <div className="bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4">Active Players</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {localPlayers.filter(p => p.alive).map(player => (
                    <div
                      key={player.id}
                      className="p-3 bg-gray-600 rounded-lg flex items-center justify-between"
                    >
                      <span>{player.name}</span>
                      <span className="text-sm text-gray-300">
                        Points: {player.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (gameState.status === 'victory') {
    return <VictoryScreen 
      winner={gameState.results?.winner || ''} 
      players={gameState.players} 
      onLeave={leaveRoom} // Add this prop
    />;
  }

  if (gameState.status === 'spectating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
        <h2 className="text-3xl font-bold mb-4">👀 Spectator Mode</h2>
        <div className="max-w-2xl w-full">
          <Results {...gameState.results!} />
          <div className="mt-6 bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Player Status</h3>
            {gameState.players.map(player => (
              <div 
                key={player.id}
                className={`p-3 mb-2 rounded-lg ${
                  player.alive ? 'bg-green-900/30' : 'bg-red-900/30'
                }`}
              >
                {player.name} - {player.alive ? 'Alive' : 'Eliminated'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  
  /* Lobby Screen */
  return (
    <PlayerLobby
    players={localPlayers}
    currentPlayerName={gameState.playerName}
    roomName={gameState.selectedRoom}
    onToggleReady={toggleReady}
    countdown={gameState.countdown} // Add this line
  />
  );
}