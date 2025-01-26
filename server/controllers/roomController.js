const { broadcastRoomData } = require("../services/roomService");
const playerImages = [
    '/images/avatars/Benzo-Yashige.png',
    '/images/avatars/Chishiya-3.jpg',
    '/images/avatars/Hinako-Daimon.png',
    '/images/avatars/Keiichi-Kuzuryu.png',
    '/images/avatars/Takashi-Asuma.png'
  ];
const handleJoinRoom = (socket, io, rooms, { playerName, room: roomName }) => {
  const room = rooms.get(roomName);
  if (room?.status !== "lobby") {
    return socket.emit("error", "Room not available");
  }
  

  if (room.players.length >= room.maxPlayers) {
    return socket.emit("error", "Room full");
  }
  const imageIndex = room.players.length % playerImages.length;
  const player = {
    id: socket.id,
    name: playerName,
    points: 0, // Reset points
    ready: false, // Reset ready status
    alive: true, // Reset alive state
    currentSelection: null, // Clear previous selections
    image: playerImages[imageIndex] // Assign image

  };

  room.players.push(player);
  socket.join(roomName);
  io.to(roomName).emit("room-update", room.players);
  broadcastRoomData(io, rooms);
};

module.exports = {
  handleJoinRoom,
};