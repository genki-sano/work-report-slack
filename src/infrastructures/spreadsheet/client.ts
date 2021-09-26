import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class SpreadsheetClient implements ISpreadsheetClient {
  private readonly ss: GoogleAppsScript.Spreadsheet.Spreadsheet
  private sheet: GoogleAppsScript.Spreadsheet.Sheet | undefined

  constructor(sheet_id: string) {
    this.ss = SpreadsheetApp.openById(sheet_id)
  }

  public getValue(range: string, sheetName: string): string {
    if (!this.sheet) {
      let sheet = this.ss.getSheetByName(sheetName)

      if (sheetName !== 'テンプレート' && !sheet) {
        // 独自設定がない場合、テンプレートを使用
        sheet = this.ss.getSheetByName('テンプレート')
        sheetName = 'テンプレート'
      }

      if (!sheet) {
        throw new Error(`not found sheet (sheet_name: ${sheetName})`)
      }

      this.sheet = sheet
    }

    const value = this.sheet.getRange(range).getValue()
    return value
  }
}
