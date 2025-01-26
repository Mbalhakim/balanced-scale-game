const { Server } = require("socket.io");
const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Room management utilities
const createRoomStructure = () => ({
  players: [],
  maxPlayers: 5,
  roundData: {},
  stage: 1,
  timer: null,
  countdownTimer: null,
  gameActive: false,
  status: 'lobby',
});

const rooms = new Map([
  ['Room1', createRoomStructure()],
  ['Room2', createRoomStructure()],
  ['Room3', createRoomStructure()],
  ['Room4', createRoomStructure()],
  ['Room5', createRoomStructure()],
]);

// Helper functions
const getRoomData = () => {
  return Array.from(rooms.entries()).map(([name, room]) => ({
    name,
    players: room.players.length,
    maxPlayers: room.maxPlayers,
    status: room.status,
  }));
};

const broadcastRoomData = () => {
  io.emit('available-rooms', getRoomData());
};

const startGameCountdown = (roomName) => {
  const room = rooms.get(roomName);
  if (!room) return;

  room.status = 'starting';
  let countdown = 3;

  const emitCountdown = () => {
    io.to(roomName).emit('countdown-update', { countdown });
  };

  emitCountdown();

  room.countdownTimer = setInterval(() => {
    countdown--;
    emitCountdown();

    if (countdown <= 0) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
      startGame(roomName);
    }
  }, 1000);
};

const startGame = (roomName) => {
  const room = rooms.get(roomName);
  if (!room) return;

  room.status = 'in-game';
  room.gameActive = true;
  room.players.forEach((p) => {
    p.ready = false;
    p.alive = true;
    p.points = 0;
    p.currentSelection = null;
  });

  io.to(roomName).emit('start-game');
  broadcastRoomData();
};

const handleRoundResults = (roomName) => {
  const room = rooms.get(roomName);
  if (!room) return;

  const numbers = Object.values(room.roundData);
  const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const target = average * 0.8;

  let winnerId = null;
  let minDiff = Infinity;
  Object.entries(room.roundData).forEach(([playerId, number]) => {
    const diff = Math.abs(number - target);
    if (diff < minDiff) {
      minDiff = diff;
      winnerId = playerId;
    }
  });

  // Update player states
  room.players.forEach((player) => {
    if (player.id !== winnerId) {
      player.points -= 1;
      if (player.points <= -3) player.alive = false;
    }
  });

  const alivePlayers = room.players.filter((p) => p.alive);
  const eliminatedPlayers = room.players.filter(p => !p.alive);
  const winner = room.players.find((p) => p.id === winnerId);

  // Handle final winner
  if (alivePlayers.length === 1) {
    io.to(alivePlayers[0].id).emit('victory', {
      winner: alivePlayers[0],
      players: room.players
    });
    eliminatedPlayers.forEach(player => {
      io.to(player.id).emit('game-over', {
        winner: alivePlayers[0].name,
        players: room.players
      });
    });
    resetRoom(roomName);
    return;
  }

  // Handle intermediate eliminations
  eliminatedPlayers.forEach(player => {
    io.to(player.id).emit('spectate-mode', {
      target,
      winner: winner?.name,
      players: room.players,
      aliveCount: alivePlayers.length
    });
  });

  // Stage progression
  let newStage = room.stage;
  if (alivePlayers.length <= 2) {
    newStage = 3;
  } else if (alivePlayers.length <= 4) {
    newStage = 2;
  }

  if (newStage !== room.stage) {
    room.stage = newStage;
    io.to(roomName).emit('stage-update', {
      stage: newStage,
      players: room.players,
      aliveCount: alivePlayers.length,
    });
  }

  room.roundData = {};
  clearTimeout(room.timer);

  // Notify all players
  io.to(roomName).emit('round-results', {
    target,
    winner: winner?.name,
    players: room.players,
    stage: room.stage,
    aliveCount: alivePlayers.length,
    status: alivePlayers.length > 2 ? 'playing' : 'stage-transition',
  });

  room.timer = setTimeout(() => {
    if (alivePlayers.length > 1) {
      io.to(roomName).emit('next-round');
    }
  }, 5000);
};

const resetRoom = (roomName) => {
  const room = rooms.get(roomName);
  if (room) {
    // Notify remaining players
    const alivePlayers = room.players.filter(p => p.alive);
    if (alivePlayers.length > 0) {
      io.to(roomName).emit('victory', {
        winner: alivePlayers[0],
        players: room.players
      });
    }
    
    // Reset room state
    clearTimeout(room.timer);
    clearInterval(room.countdownTimer);
    io.to(roomName).emit('force-leave-room');
    rooms.set(roomName, createRoomStructure());
    broadcastRoomData();
  }
};



io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  broadcastRoomData();

  socket.on('join-room', ({ playerName, room: roomName }) => {
    const room = rooms.get(roomName);
    if (!room || room.status !== 'lobby') {
      return socket.emit('error', room ? 'Game in progress' : 'Room not found');
    }

    if (room.players.length >= room.maxPlayers) {
      return socket.emit('error', 'Room full');
    }

    const player = {
      id: socket.id,
      name: playerName,
      points: 0,
      ready: false,
      alive: true,
      currentSelection: null,
    };

    room.players.push(player);
    socket.join(roomName);
    io.to(roomName).emit('room-update', room.players);
    broadcastRoomData();
  });

  socket.on('select-number', ({ room: roomName, number }) => {
    const room = rooms.get(roomName);
    if (!room || !room.gameActive) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player?.alive) return;

    room.roundData[socket.id] = number;
    io.to(roomName).emit('number-selected', {
      playerName: player.name,
      number,
    });

    const alivePlayers = room.players.filter((p) => p.alive);
    if (alivePlayers.every((p) => room.roundData[p.id] !== undefined)) {
      handleRoundResults(roomName);
    }
  });

  socket.on('toggle-ready', ({ room: roomName }) => {
    const room = rooms.get(roomName);
    if (!room || room.status !== 'lobby') return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomName).emit('room-update', room.players);

      const allReady = room.players.length >= 2 &&
        room.players.every((p) => p.ready) &&
        room.players.every((p) => p.alive);

      if (allReady && !room.countdownTimer) {
        startGameCountdown(roomName);
      } else if (!allReady && room.countdownTimer) {
        clearInterval(room.countdownTimer);
        room.countdownTimer = null;
        room.status = 'lobby';
        io.to(roomName).emit('countdown-cancel');
      }
    }
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomName) => {
      const index = room.players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);

        if (room.status === 'starting') {
          clearInterval(room.countdownTimer);
          room.countdownTimer = null;
          room.status = 'lobby';
          io.to(roomName).emit('countdown-cancel');
        }

        io.to(roomName).emit('room-update', room.players);
        broadcastRoomData();
      }
    });
  });
});

console.log("Socket.IO server running on http://localhost:3001");
