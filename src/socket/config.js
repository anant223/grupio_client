import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL;
console.log(SOCKET_SERVER_URL)

if (!SOCKET_SERVER_URL) {
  console.warn("SOCKET_URL is not defined in env");
}

const socketConfig = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

export const connectSocket = () => {
  if (socketConfig.connected) return;
  socketConfig.connect();
}

export const disConnectSocket = () => {
  if (socketConfig.disconnected) return;
  socketConfig.disconnect();
};

export default socketConfig;
