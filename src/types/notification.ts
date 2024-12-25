export enum NotificationType {
  TOURNAMENT_TEAM_APPROVE,
}

export interface INotification {
  message: string;
  type: NotificationType;
}
