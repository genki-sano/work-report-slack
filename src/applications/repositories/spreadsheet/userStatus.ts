export enum UserStatusType {
  Office,
  House,
  Away,
  End,
}

export interface IUserStatusGateway {
  getIcon(statusType: UserStatusType, sheetName?: string): string
  getText(statusType: UserStatusType, sheetName?: string): string
}
