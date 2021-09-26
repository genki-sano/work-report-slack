import {
  ISlackClient,
  WebAPICallHeaders,
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'

export class SlackClient implements ISlackClient {
  private readonly token: string
  private readonly baseUrl: string

  constructor(token: string) {
    this.token = token
    this.baseUrl = 'https://slack.com/api/'
  }

  public apiCall(
    method: string,
    headers: WebAPICallHeaders,
    options: WebAPICallOptions,
  ): WebAPICallResult {
    const url = `${this.baseUrl}${method}`
    const requestOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...headers,
      },
      payload: JSON.stringify(options),
    }
    const response = UrlFetchApp.fetch(url, requestOptions)

    const result: WebAPICallResult = JSON.parse(response.getContentText())
    if (!result.ok) {
      const suffixMethod = `method: ${method}`
      const suffixOpotion = `options: ${JSON.stringify(requestOptions)}`
      const suffix = `${suffixMethod}, ${suffixOpotion}`
      throw new Error(`${result.error} (${suffix})`)
    }

    return result
  }
}
