const { handleJoinRoom } = require("./roomController");
const { handleSelectNumber, handleToggleReady } = require("./gameController");
const { broadcastRoomData, createRoomStructure } = require("../services/roomService");

const handleConnection = (socket, io, rooms) => {
  console.log("Player connected:", socket.id);
  broadcastRoomData(io, rooms);

  // playerController.js - Update room cleanup logic
const handleLeaveCommon = (room, roomName, io, rooms) => {
    if (room.players.length === 0) {
      // Completely reset room state
      rooms.set(roomName, createRoomStructure());
      broadcastRoomData(io, rooms);
    }
  };
 // playerController.js
 socket.on("leave-room", () => {
    rooms.forEach((room, roomName) => {
      const index = room.players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        io.to(roomName).emit("room-update", room.players);
        broadcastRoomData(io, rooms);
        handleLeaveCommon(room, roomName, io, rooms);
      }
    });
  });
  socket.on("join-room", (data) => handleJoinRoom(socket, io, rooms, data));
  socket.on("select-number", (data) => handleSelectNumber(socket, io, rooms, data));
  socket.on("toggle-ready", (data) => handleToggleReady(socket, io, rooms, data));

  // In the disconnect handler, update the room state without affecting game status:
socket.on("disconnect", () => {
    rooms.forEach((room, roomName) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) return;
  
      room.players.splice(playerIndex, 1);
      
      // Only emit room-update if game is not active
      if (room.status === 'lobby') {
        io.to(roomName).emit("room-update", room.players);
      }
      
      // Reset room if empty
      if (room.players.length === 0) {
        rooms.set(roomName, createRoomStructure());
      }
      
      broadcastRoomData(io, rooms);
    });
  });
};

module.exports = {
  handleConnection,
};