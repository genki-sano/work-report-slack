export class Profile {
  private readonly _statusEmoji: string
  private readonly _statusText: string
  private readonly _status_expiration: number

  get status_emoji(): string {
    return this._statusEmoji
  }

  get status_text(): string {
    return this._statusText
  }

  get status_expiration(): number {
    return this._status_expiration
  }

  constructor(
    statusEmoji: string,
    statusText: string,
    statusExpiration: number = 0,
  ) {
    this._statusEmoji = `:${statusEmoji}:`
    this._statusText = statusText
    this._status_expiration = statusExpiration
  }
}
