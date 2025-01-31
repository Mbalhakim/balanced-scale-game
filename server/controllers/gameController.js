const { startGameCountdown, startGame, resetRoom } = require("../services/gameService");

// Helper functions
const getValidSubmissions = (room, alivePlayerIds) => {
  return Object.entries(room.roundData)
    .filter(([playerId]) => alivePlayerIds.has(playerId))
    .map(([_, number]) => number);
};

const calculateTarget = (validSubmissions) => {
  const average = validSubmissions.reduce((sum, num) => sum + num, 0) / validSubmissions.length;
  return average * 0.8;
};

const determineRoundWinner = (room, alivePlayerIds, target) => {
  let roundWinnerId = null;
  let minDiff = Infinity;
  let earliestTimestamp = Infinity;

  Object.entries(room.roundData).forEach(([playerId, number]) => {
    if (!alivePlayerIds.has(playerId)) return;

    const diff = Math.abs(number - target);
    const submissionTime = room.submissionTimestamps?.[playerId] || 0;

    if (diff < minDiff || (diff === minDiff && submissionTime < earliestTimestamp)) {
      minDiff = diff;
      roundWinnerId = playerId;
      earliestTimestamp = submissionTime;
    }
  });

  return {
    winner: room.players.find((p) => p.id === roundWinnerId),
    losers: room.players.filter(p => p.id !== roundWinnerId && p.alive)
  };
};

const updatePlayerStates = (roundLosers, aliveCount) => {
  roundLosers.forEach((player) => {
    if (player.alive) {
      player.points -= 1;
      if (aliveCount <= 2 || player.points <= -3) {
        player.alive = false;
      }
    }
  });
};

const handleGameWinner = (roomName, room, io, rooms) => {
    const gameWinner = room.players.find((p) => p.alive);
    io.to(gameWinner.id).emit("victory", {
      winner: gameWinner,
      players: room.players,
      isGameWinner: true,
    });
  
    room.players.filter((p) => p.id !== gameWinner.id).forEach((loser) => {
      io.to(loser.id).emit("game-over", {
        winner: gameWinner.name,
        players: room.players,
        isGameLoser: true,
      });
    });
  
    resetRoom(roomName, room, io, rooms);
  };

const handleEliminatedPlayers = (room, target, roundWinner, aliveCount, io) => {
  room.players.filter((p) => !p.alive).forEach((player) => {
    io.to(player.id).emit("spectate-mode", {
      target,
      roundWinner: roundWinner?.name,
      players: room.players,
      aliveCount,
    });
  });
};

const updateGameStage = (room, aliveCount, io, roomName) => {
  let newStage = room.stage;
  if (aliveCount <= 2) newStage = 3;
  else if (aliveCount <= 4) newStage = 2;

  if (newStage !== room.stage) {
    room.stage = newStage;
    io.to(roomName).emit("stage-update", {
      stage: newStage,
      players: room.players,
      aliveCount,
    });
  }
};

const resetRoundData = (room) => {
  room.roundData = {};
  room.submissionTimestamps = {};
  clearTimeout(room.timer);
};

const prepareNextRound = (room, alivePlayersUpdated, io) => {
  room.timer = setTimeout(() => {
    alivePlayersUpdated.forEach((player) => {
      io.to(player.id).emit("next-round");
    });
  }, 3000);
};

const notifyRoundResults = (io, roomName, target, roundWinner, roundLoserNames, room, aliveCount) => {
  io.to(roomName).emit("round-results", {
    target: Number(target.toFixed(2)),
    roundWinner: roundWinner?.name || "Who",
    roundLosers: roundLoserNames,
    players: room.players,
    stage: room.stage,
    aliveCount,
    status: aliveCount > 2 ? "playing" : "stage-transition",
  });
};

// Main handler
const handleRoundResults = (roomName, room, io, rooms) => {
  const alivePlayers = room.players.filter((p) => p.alive);
  const alivePlayerIds = new Set(alivePlayers.map((p) => p.id));
  
  const validSubmissions = getValidSubmissions(room, alivePlayerIds);
  const target = calculateTarget(validSubmissions);
  
  const { winner: roundWinner, losers: roundLosers } = determineRoundWinner(room, alivePlayerIds, target);
  const roundLoserNames = roundLosers.map(p => p.name);
  
  updatePlayerStates(roundLosers, alivePlayers.length);
  const alivePlayersUpdated = room.players.filter((p) => p.alive);

  if (alivePlayersUpdated.length === 1) {
    handleGameWinner(roomName, room, io, rooms);
    return;
  }

  if (alivePlayersUpdated.length > 2) {
    handleEliminatedPlayers(room, target, roundWinner, alivePlayersUpdated.length, io);
  }

  updateGameStage(room, alivePlayersUpdated.length, io, roomName);
  resetRoundData(room);
  notifyRoundResults(io, roomName, target, roundWinner, roundLoserNames, room, alivePlayersUpdated.length);
  prepareNextRound(room, alivePlayersUpdated, io);
};


const handleSelectNumber = (socket, io, rooms, { room: roomName, number }) => {
  const room = rooms.get(roomName);
  if (!room || !room.gameActive) return;

  const player = room.players.find((p) => p.id === socket.id);
  if (!player?.alive) return;

  // Record submission with timestamp
  room.roundData[socket.id] = number;
  room.submissionTimestamps = room.submissionTimestamps || {};
  room.submissionTimestamps[socket.id] = Date.now();

  io.to(roomName).emit("number-selected", {
    playerName: player.name,
    number,
  });

  // Check submissions from current alive players only
  const alivePlayers = room.players.filter((p) => p.alive);
  const allSubmitted = alivePlayers.every(
    (p) => room.roundData[p.id] !== undefined
  );

  if (allSubmitted) {
    handleRoundResults(roomName, room, io, rooms);
   
  }
};

const handleToggleReady = (socket, io, rooms, { room: roomName }) => {
  const room = rooms.get(roomName);
  if (!room || room.status !== "lobby") return;

  const player = room.players.find((p) => p.id === socket.id);
  if (player) {
    player.ready = !player.ready;
    io.to(roomName).emit("room-update", room.players);

    const allReady =
      room.players.length >= 2 &&
      room.players.every((p) => p.ready) &&
      room.players.every((p) => p.alive);

    if (allReady && !room.countdownTimer) {
      startGameCountdown(roomName, room, io, rooms);
    } else if (!allReady && room.countdownTimer) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
      room.status = "lobby";
      io.to(roomName).emit("countdown-cancel");
    }
  }
};

module.exports = {
  handleSelectNumber,
  handleToggleReady,
  handleRoundResults, // Export the new function
};
