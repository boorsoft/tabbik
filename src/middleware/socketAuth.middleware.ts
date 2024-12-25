import { Socket } from "socket.io";
import { verifyToken } from "../common/utils/jwt";

const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  let token =
    socket.handshake.auth?.token || socket.handshake.headers?.authorization;

  if (!token) {
    return next(new Error("Token not provided"));
  }

  try {
    if (token.startsWith("Bearer")) {
      token = token.slice(7);
    }

    const user = verifyToken(token);

    socket.data.user = user;

    next();
  } catch (e) {
    next(new Error("Authentication error: invalid token"));
  }
};

export default socketAuthMiddleware;
