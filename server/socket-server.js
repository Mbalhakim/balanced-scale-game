const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = {
  Room1: { players: [], maxPlayers: 5, roundData: {}, stage: 1 },
  Room2: { players: [], maxPlayers: 5, roundData: {}, stage: 1 },
  Room3: { players: [], maxPlayers: 5, roundData: {}, stage: 1 },
  Room4: { players: [], maxPlayers: 5, roundData: {}, stage: 1 },
  Room5: { players: [], maxPlayers: 5, roundData: {}, stage: 1 },
};

const emitRoomData = () => {
  const roomData = Object.keys(rooms).map((room) => ({
    name: room,
    players: rooms[room].players.length,
    maxPlayers: rooms[room].maxPlayers,
  }));
  io.emit("available-rooms", roomData);
};

const checkAllReady = (room) => {
  const roomPlayers = rooms[room]?.players || [];
  return roomPlayers.length > 1 && roomPlayers.every((player) => player.ready);
};

const getAlivePlayers = (room) => {
  return rooms[room]?.players.filter((player) => player.alive).length || 0;
};

const allPlayersSelected = (room) => {
  const alivePlayers = rooms[room]?.players.filter((player) => player.alive) || [];
  return alivePlayers.every((player) => rooms[room].roundData[player.id] !== undefined);
};

const updateStage = (room) => {
  const alivePlayers = getAlivePlayers(room);

  let newStage = 1;
  if (alivePlayers <= 2) newStage = 3;
  else if (alivePlayers <= 4) newStage = 2;

  if (rooms[room].stage !== newStage) {
    rooms[room].stage = newStage;
    io.to(room).emit("stage-update", { stage: newStage });
    console.log(`Stage updated to ${newStage} in ${room}`);
  }
};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  emitRoomData();

  socket.on("join-room", ({ playerName, room }) => {
    if (!rooms[room]) {
      socket.emit("error", "Room does not exist");
      return;
    }

    if (rooms[room].players.length >= rooms[room].maxPlayers) {
      socket.emit("error", "Room is full");
      return;
    }

    rooms[room].players.push({ id: socket.id, name: playerName, points: 0, ready: false, alive: true });
    socket.join(room);

    emitRoomData();
    io.to(room).emit("room-update", rooms[room]);
    console.log(`${playerName} joined ${room}`);
  });

  socket.on("select-number", ({ room, number }) => {
    if (!rooms[room]) return;

    const player = rooms[room].players.find((p) => p.id === socket.id);
    if (!player || !player.alive) return; // Ignore selections from eliminated players

    rooms[room].roundData[socket.id] = number;

    io.to(room).emit("number-selected", { playerName: player.name, number });

    if (allPlayersSelected(room)) {
      // Calculate results
      const numbers = Object.values(rooms[room].roundData);
      const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const target = average * 0.8;

      let winner = null;
      let minDifference = Infinity;
      for (const [id, num] of Object.entries(rooms[room].roundData)) {
        const difference = Math.abs(num - target);
        if (difference < minDifference) {
          minDifference = difference;
          winner = id;
        }
      }

      const winnerName = rooms[room].players.find((p) => p.id === winner)?.name;

      rooms[room].players.forEach((player) => {
        if (player.id !== winner) {
          player.points -= 1;
          if (player.points <= -3) {
            player.alive = false;
            console.log(`${player.name} has been eliminated!`);
          }
        }
      });

      io.to(room).emit("round-results", {
        target,
        winner: winnerName,
        players: rooms[room].players,
      });

      rooms[room].roundData = {};
      updateStage(room);

      // Start the next round after a short delay
      setTimeout(() => {
        io.to(room).emit("next-round");
        console.log(`Next round started in ${room}`);
      }, 2000); // 5-second delay before the next round
    }
  });

  socket.on("toggle-ready", ({ room }) => {
    const player = rooms[room]?.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(room).emit("room-update", rooms[room]);

      if (checkAllReady(room)) {
        io.to(room).emit("start-game");
        console.log(`Game started in ${room}`);
      }
    }
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      const index = rooms[room].players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        rooms[room].players.splice(index, 1);
        io.to(room).emit("room-update", rooms[room]);
        console.log(`Player ${socket.id} left ${room}`);
        break;
      }
    }
    emitRoomData();
  });
});

console.log("Socket.IO server running on http://localhost:3001");
