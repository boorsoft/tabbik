import { Socket } from "socket.io";
import { RequestUser } from "../../db/schema/user";
import TournamentSocketService from "./services/tournamentSocket.service";
import UserSocketService from "./services/userSocket.service";

class SocketManager {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  handleUserEvents(user: RequestUser) {
    const userService = UserSocketService.init(this.socket, user);
    userService.handleDisconnect();
  }

  handleTournamentEvents() {
    const tournamentService = TournamentSocketService.init(this.socket);

    tournamentService.handleJoinTournament();
  }

  static init(socket: Socket) {
    return new SocketManager(socket);
  }
}

export default SocketManager;
