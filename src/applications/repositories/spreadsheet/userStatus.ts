export enum UserStatusType {
  Office,
  House,
  Away,
  End,
}

export interface IUserStatusGateway {
  getIcon(statusType: UserStatusType): string
  getText(statusType: UserStatusType): string
}
