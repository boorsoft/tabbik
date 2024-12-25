import { SocketEvents } from "../constants/socketEvents";
import { getIo } from "../common/socket/socket";
import { INotification } from "@/common/types/notification";

export async function sendUserNotification(
  data: INotification,
  userId: string
) {
  const io = getIo();

  io.to(`user_${userId}`).emit(SocketEvents.NOTIFICATION, data);
}

export async function sendNotification(data: INotification, room: string) {
  const io = getIo();

  io.to(room).emit(SocketEvents.NOTIFICATION, data);
}
