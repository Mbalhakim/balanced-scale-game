import { io, Socket } from "socket.io-client";

// app/util/socket.ts
let socket: Socket | null = null;

export const initSocket = (url: string) => {
  if (!socket) {
    socket = io(url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });
  }
  return socket;
};

export const getSocket = () => socket;

// Add this to preserve connection
export const maintainSocketConnection = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};