import { io } from "socket.io-client";

const socket = io("https://shophub-backend-5fs0.onrender.com", {
  withCredentials: true,
});

export default socket;