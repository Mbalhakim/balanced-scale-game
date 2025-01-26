const createRoomStructure = () => ({
    players: [],
    maxPlayers: 5,
    roundData: {},
    stage: 1,
    timer: null,
    countdownTimer: null,
    gameActive: false, // Critical reset
    status: "lobby", // Reset to joinable state
  });
  
  const initializeRooms = () => {
    return new Map([
      ["Room1", createRoomStructure()],
      ["Room2", createRoomStructure()],
      ["Room3", createRoomStructure()],
      ["Room4", createRoomStructure()],
      ["Room5", createRoomStructure()],
    ]);
  };
  
  const getRoomData = (rooms) => {
    return Array.from(rooms.entries()).map(([name, room]) => ({
      name,
      players: room.players.length,
      maxPlayers: room.maxPlayers,
      status: room.status,
    }));
  };
  
  const broadcastRoomData = (io, rooms) => {
    io.emit("available-rooms", getRoomData(rooms));
  };
  
  module.exports = {
    createRoomStructure,
    initializeRooms,
    getRoomData,
    broadcastRoomData,
  };