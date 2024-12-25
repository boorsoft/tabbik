import { Socket } from "socket.io";
import { RequestUser } from "../../../db/schema/user";
import { SocketEvents } from "../../../constants/socketEvents";

class UserSocketService {
  private socket: Socket;
  private user: RequestUser;

  constructor(socket: Socket, user: RequestUser) {
    this.socket = socket;
    this.user = user;
  }

  joinUserRoom() {
    this.socket.join(`user_${this.user.id}`);
  }

  handleDisconnect() {
    this.socket.on(SocketEvents.DISCONNECT, () => {
      console.log(`User ${this.user.id} disconnected`);
    });
  }

  static init(socket: Socket, user: RequestUser): UserSocketService {
    const service = new UserSocketService(socket, user);
    service.joinUserRoom();

    return service;
  }
}

export default UserSocketService;
