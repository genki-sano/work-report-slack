import {
  IUserStatusGateway,
  UserStatusType,
} from '@/applications/repositories/spreadsheet/userStatus'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class UserStatusGateway implements IUserStatusGateway {
  private readonly client: ISpreadsheetClient

  constructor(client: ISpreadsheetClient) {
    this.client = client
  }

  public getIcon(
    statusType: UserStatusType,
    sheetName: string = 'テンプレート',
  ): string {
    const range = `B${statusType + 2}`
    return this.client.getValue(range, sheetName)
  }

  public getText(
    statusType: UserStatusType,
    sheetName: string = 'テンプレート',
  ): string {
    const range = `C${statusType + 2}`
    return this.client.getValue(range, sheetName)
  }
}
