const { startGameCountdown, startGame, resetRoom } = require("../services/gameService");

const handleRoundResults = (roomName, room, io, rooms) => {
    // Filter out submissions from non-alive players
    const alivePlayers = room.players.filter(p => p.alive);
    const alivePlayerIds = new Set(alivePlayers.map(p => p.id));
    const validSubmissions = Object.entries(room.roundData)
        .filter(([playerId]) => alivePlayerIds.has(playerId))
        .map(([_, number]) => number);

    // Calculate target using only valid submissions
    const average = validSubmissions.reduce((sum, num) => sum + num, 0) / validSubmissions.length;
    const target = average * 0.8;

    // Find closest number to target with tiebreaker
    let roundWinnerId = null;
    let minDiff = Infinity;
    let earliestTimestamp = Infinity;

    Object.entries(room.roundData).forEach(([playerId, number]) => {
        if (!alivePlayerIds.has(playerId)) return;

        const diff = Math.abs(number - target);
        const submissionTime = room.submissionTimestamps?.[playerId] || 0;

        if (diff < minDiff || 
            (diff === minDiff && submissionTime < earliestTimestamp)) {
            minDiff = diff;
            roundWinnerId = playerId;
            earliestTimestamp = submissionTime;
        }
    });

    const roundWinner = room.players.find((p) => p.id === roundWinnerId);
    const roundLosers = room.players.filter((p) => p.id !== roundWinnerId);

    // Update player states
    roundLosers.forEach((player) => {
        if (player.alive) { // Only penalize alive players
            player.points -= 1;
            if (player.points <= -5) {
                player.alive = false;
            }
        }
    });

    const alivePlayersUpdated = room.players.filter((p) => p.alive);

    // Handle game winner
    if (alivePlayersUpdated.length === 1) {
        const gameWinner = alivePlayersUpdated[0];
        io.to(gameWinner.id).emit("victory", {
            winner: gameWinner,
            players: room.players,
        });
        room.players.filter(p => p.id !== gameWinner.id).forEach(loser => {
            io.to(loser.id).emit("game-over", {
                winner: gameWinner.name,
                players: room.players,
            });
        });
        resetRoom(roomName, room, io, rooms);
        return;
    }

    // Handle eliminated players
    room.players.filter(p => !p.alive).forEach(player => {
        io.to(player.id).emit("spectate-mode", {
            target,
            roundWinner: roundWinner?.name,
            players: room.players,
            aliveCount: alivePlayersUpdated.length,
        });
    });

    // Stage progression
    let newStage = room.stage;
    if (alivePlayersUpdated.length <= 2) newStage = 3;
    else if (alivePlayersUpdated.length <= 4) newStage = 2;
    
    if (newStage !== room.stage) {
        room.stage = newStage;
        io.to(roomName).emit("stage-update", {
            stage: newStage,
            players: room.players,
            aliveCount: alivePlayersUpdated.length,
        });
    }

    // Reset round data and timers
    room.roundData = {};
    room.submissionTimestamps = {};
    clearTimeout(room.timer);

    // Notify players
    io.to(roomName).emit("round-results", {
        target: Number(target.toFixed(2)),
        roundWinner: roundWinner?.name,
        players: room.players,
        stage: room.stage,
        aliveCount: alivePlayersUpdated.length,
        status: alivePlayersUpdated.length > 2 ? "playing" : "stage-transition",
    });

    // Prepare next round
    // room.timer = setTimeout(() => {
    //     alivePlayersUpdated.forEach(player => {
    //         io.to(player.id).emit("next-round");
    //     });
    // }, 5000);
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
    const alivePlayers = room.players.filter(p => p.alive);
    const allSubmitted = alivePlayers.every(p => room.roundData[p.id] !== undefined);

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