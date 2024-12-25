export enum NotificationType {
  TOURNAMENT_TEAM_APPROVE,
  TOURNAMENT_TEAM_INVITE,
}

export interface INotification {
  message: string;
  data: Record<string, any> | null;
  type: NotificationType;
}
