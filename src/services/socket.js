import { io } from "socket.io-client";

// https://chess-game-server-1.onrender.com - online server

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("https://chess-game-server-1.onrender.com", {
      withCredentials: true,
    });
  }
  // console.log("connected to sockets");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // console.log("disconnected from sockets");
};

export default socket;
