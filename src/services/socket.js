// services/socket.js
import { io } from "socket.io-client";

const socket = io("https://chess-game-server-1.onrender.com");

export default socket;
