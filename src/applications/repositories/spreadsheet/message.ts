export enum MessageType {
  Start,
  Lunch,
  Back,
  End,
}

export interface IMessageGateway {
  getText(statusType: MessageType, sheetName?: string): string
}
