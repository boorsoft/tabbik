import { Socket } from "socket.io";
import { SocketEvents } from "../../../constants/socketEvents";

class TournamentSocketService {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  joinTournament(tournamentId: number) {
    this.socket.join(`tournament_${tournamentId}`);
  }

  handleJoinTournament() {
    this.socket.on(SocketEvents.JOIN_TOURNAMENT, (tournamentId: number) => {
      this.joinTournament(tournamentId);
    });
  }

  static init(socket: Socket): TournamentSocketService {
    return new TournamentSocketService(socket);
  }
}

export default TournamentSocketService;
