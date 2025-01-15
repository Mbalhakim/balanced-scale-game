import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (serverURL: string) => {
  if (!socket) {
    socket = io(serverURL);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;
