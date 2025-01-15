const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Predefined rooms with a maximum of 5 players
const rooms = {
  Room1: { players: [], maxPlayers: 5, roundData: {} },
  Room2: { players: [], maxPlayers: 5, roundData: {} },
  Room3: { players: [], maxPlayers: 5, roundData: {} },
  Room4: { players: [], maxPlayers: 5, roundData: {} },
  Room5: { players: [], maxPlayers: 5, roundData: {} },
};

// Check if all players in a room are ready and there are at least 2 players
const checkAllReady = (room) => {
  const roomPlayers = rooms[room]?.players || [];
  return roomPlayers.length > 1 && roomPlayers.every((player) => player.ready);
};

// Check if all players have selected a number
const allPlayersSelected = (room) => {
  const roomPlayers = rooms[room]?.players || [];
  return roomPlayers.every((player) => rooms[room].roundData[player.id] !== undefined);
};

// Emit updated room occupancy to all clients
const emitRoomData = () => {
  const roomData = Object.keys(rooms).map((room) => ({
    name: room,
    players: rooms[room].players.length,
    maxPlayers: rooms[room].maxPlayers,
  }));
  io.emit("available-rooms", roomData);
};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Send initial room data to the client
  emitRoomData();

  // Handle joining a room
  socket.on("join-room", ({ playerName, room }) => {
    if (!rooms[room]) {
      socket.emit("error", "Room does not exist");
      return;
    }

    
    // Prevent joining if the room is full
    if (rooms[room].players.length >= rooms[room].maxPlayers) {
      socket.emit("error", "Room is full");
      return;
    }

    // Join the room
    socket.join(room);
    rooms[room].players.push({ id: socket.id, name: playerName, ready: false });

    // Broadcast updated room and occupancy data
    emitRoomData();
    io.to(room).emit("room-update", rooms[room]);
    console.log(`${playerName} joined ${room}`);
  });
  socket.on("select-number", ({ room, number }) => {
    if (!rooms[room]) return;

    // Store the player's number
    rooms[room].roundData[socket.id] = number;

    // Broadcast the selected number to the room
    const player = rooms[room].players.find((p) => p.id === socket.id);
    io.to(room).emit("number-selected", { playerName: player.name, number });

    // Check if all players have selected a number
    if (allPlayersSelected(room)) {
      // Calculate results
      const numbers = Object.values(rooms[room].roundData);
      const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const target = average * 0.8;

      // Determine the winner
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

      // Broadcast the results
      io.to(room).emit("round-results", { target, winner: winnerName });

      // Reset round data
      rooms[room].roundData = {};
    }
  });

  // Handle readiness toggle
  socket.on("toggle-ready", ({ room }) => {
    const player = rooms[room]?.players.find((p) => p.id === socket.id);
    if (player) {
      player.ready = !player.ready; // Toggle readiness
      io.to(room).emit("room-update", rooms[room]); // Broadcast update
      console.log(`${player.name} is now ${player.ready ? "ready" : "not ready"}`);

      // Start game only if all players are ready and the room has at least 2 players
      if (checkAllReady(room)) {
        io.to(room).emit("start-game"); // Broadcast start-game event
        console.log(`Game started in ${room}`);
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const room in rooms) {
      const index = rooms[room].players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        rooms[room].players.splice(index, 1);
        io.to(room).emit("room-update", rooms[room]); // Notify remaining players
        console.log(`Player ${socket.id} left ${room}`);
        break;
      }
    }
    emitRoomData();
  });
});

console.log("Socket.IO server running on http://localhost:3001");
