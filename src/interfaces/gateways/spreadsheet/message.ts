import {
  IMessageGateway,
  MessageType,
} from '@/applications/repositories/spreadsheet/message'
import { SHEET_NAME_DEFAULT } from '@/constants/spreadsheet'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class MessageGateway implements IMessageGateway {
  private readonly client: ISpreadsheetClient

  constructor(client: ISpreadsheetClient) {
    this.client = client
  }

  public getText(
    messageType: MessageType,
    sheetName: string = SHEET_NAME_DEFAULT,
  ): string {
    const range = `F${messageType + 2}`
    return this.client.getValue(range, sheetName)
  }
}
