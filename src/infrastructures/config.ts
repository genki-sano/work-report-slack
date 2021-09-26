export class Config {
  readonly legacyVerificationToken: string
  readonly slackBotToken: string
  readonly spreadsheetId: string

  constructor() {
    this.legacyVerificationToken = this.getProperty('SLACK_VERIFICATION_TOKEN')
    this.slackBotToken = this.getProperty('SLACK_BOT_TOKEN')
    this.spreadsheetId = this.getProperty('SPREADSHEET_ID')
  }

  private getProperty(key: string): string {
    const prop = PropertiesService.getScriptProperties().getProperty(key)
    if (!prop) {
      throw new Error(`not found property (key: ${key})`)
    }
    return prop
  }
}
