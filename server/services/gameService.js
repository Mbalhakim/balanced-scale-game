const { broadcastRoomData, createRoomStructure } = require("./roomService");
// In gameService.js

const startGameCountdown = (roomName, room, io, rooms) => {
  room.status = "starting";
  let countdown = 3;

  const emitCountdown = () => {
    io.to(roomName).emit("countdown-update", { countdown });
  };

  emitCountdown();

  room.countdownTimer = setInterval(() => {
    countdown--;
    emitCountdown();

    if (countdown <= 0) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
      startGame(roomName, room, io, rooms);
    }
  }, 1000);
};

const startGame = (roomName, room, io, rooms) => {
  room.status = "in-game";
  room.gameActive = true;
  room.players.forEach((p) => {
    p.ready = false;
    p.alive = true;
    p.points = 0;
    p.currentSelection = null;
  });

  io.to(roomName).emit("start-game");
  broadcastRoomData(io, rooms);
};

// In gameService.js, modify resetRoom to delay room cleanup:
const resetRoom = (roomName, room, io, rooms) => {
    const shouldReset = room.players.every(p => !p.alive) || room.players.length === 0;
    
    if (shouldReset) {
      rooms.set(roomName, createRoomStructure());
      broadcastRoomData(io, rooms);
    }
  };

module.exports = {
  startGameCountdown,
  startGame,
  resetRoom,
};