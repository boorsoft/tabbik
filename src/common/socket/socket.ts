import { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";
import socketAuthMiddleware from "../../middleware/socketAuth.middleware";
import { User } from "../../db/schema/user";
import { SocketEvents } from "../../constants/socketEvents";
import SocketManager from "./socketManager";

let io: Server | null = null;

export const initSocket = (server: HTTPServer): Server => {
  io = new Server(server, { cors: { origin: "*", methods: ["POST", "GET"] } });

  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECTION, (socket) => {
    const user = socket.data.user as User;

    console.log(`User connected with ID: ${user.id}`);

    const socketManager = SocketManager.init(socket);

    socketManager.handleUserEvents(user);
    socketManager.handleTournamentEvents();
  });

  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
