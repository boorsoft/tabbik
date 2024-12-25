export enum NotificationType {
  TOURNAMENT_TEAM_APPROVE,
  TOURNAMENT_TEAM_INVITE,
}

export interface INotification {
  message: string;
  type: NotificationType;
}
