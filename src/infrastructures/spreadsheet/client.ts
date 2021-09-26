import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class SpreadsheetClient implements ISpreadsheetClient {
  private readonly ss: GoogleAppsScript.Spreadsheet.Spreadsheet
  private sheet: GoogleAppsScript.Spreadsheet.Sheet | undefined

  constructor(sheet_id: string) {
    this.ss = SpreadsheetApp.openById(sheet_id)
  }

  public getValue(sheet_name: string, range: string): string {
    if (!this.sheet) {
      const sheet = this.ss.getSheetByName(sheet_name)
      if (!sheet) {
        throw new Error(`not found sheet (sheet_name: ${sheet_name})`)
      }

      this.sheet = sheet
    }

    const value = this.sheet.getRange(range).getValue()
    return value
  }
}
