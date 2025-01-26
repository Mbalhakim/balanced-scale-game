const { Server } = require("socket.io");
const { handleConnection } = require("./controllers/playerController");
const { initializeRooms } = require("./services/roomService");

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Initialize rooms
const rooms = initializeRooms();

// Handle socket connections
io.on("connection", (socket) => {
  handleConnection(socket, io, rooms);
});

console.log("Socket.IO server running on http://localhost:3001");