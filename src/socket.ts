import { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";
import socketAuthMiddleware from "./middleware/socketAuth.middleware";
import { User } from "./db/schema/user";
import { SocketEvents } from "./constants/socketEvents";

let io: Server | null = null;

export const initSocket = (server: HTTPServer): Server => {
  io = new Server(server, { cors: { origin: "*", methods: ["POST", "GET"] } });

  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECTION, (socket) => {
    const user = socket.data.user as User;

    console.log(`User connected with ID: ${user.id}`);

    socket.join(user.id.toString());

    socket.on(SocketEvents.DISCONNECT, () => {
      console.log(`User ${user.id} disconnected`);
    });
  });

  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
