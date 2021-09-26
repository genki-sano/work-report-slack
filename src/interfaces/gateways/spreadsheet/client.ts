export interface ISpreadsheetClient {
  getValue(sheet_name: string, range: string): string
}
