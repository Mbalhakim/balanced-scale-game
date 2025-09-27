const { Server } = require("socket.io");
const { handleConnection } = require("./controllers/playerController");
const { initializeRooms } = require("./services/roomService");

const CONFIG = {
  PORT : process.env.PORT || 3001,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000"
};

try{
  const io = new Server(CONFIG.PORT, {
  cors: {
    origin: CONFIG.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
// Initialize rooms
const rooms = initializeRooms();

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`[${new Date().toString()}] PLayer connected: ${socket.id}`);
  handleConnection(socket, io, rooms);
});

}
catch(error){
  console.error(`failed to start server on port : ${CONFIG.PORT}`)
  console.error(`Error : ${error.message}`)

  if (error.code == 'EADDRINUSE'){
    console.log(`PORT ${CONFIG.PORT} is already in use.`)
}
  process.exit(1); // Exit with error code
}


