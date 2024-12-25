import { SocketEvents } from "../constants/socketEvents";
import { getIo } from "../socket";
import { INotification } from "../types/notification";

export async function sendNotificationToUser(
  data: INotification,
  userId: string
) {
  const io = getIo();

  io.to(userId).emit(SocketEvents.NOTIFICATION, data);
}

export async function sendNotification(data: INotification, room: string) {
  const io = getIo();

  io.to(room).emit(SocketEvents.NOTIFICATION, data);
}
