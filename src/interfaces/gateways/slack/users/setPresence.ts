import {
  IUsersSetPresenceGateway,
  UsersSetPresenceArguments,
  UsersSetPresenceResult,
} from '@/applications/repositories/slack/users/setPresence'
import {
  ISlackClient,
  WebAPICallHeaders,
} from '@/interfaces/gateways/slack/client'

export class UsersSetPresence implements IUsersSetPresenceGateway {
  private readonly client: ISlackClient
  private readonly method: string

  constructor(client: ISlackClient) {
    this.client = client
    this.method = 'users.setPresence'
  }

  public execute(
    args: UsersSetPresenceArguments,
    userId: string,
  ): UsersSetPresenceResult {
    const headers: WebAPICallHeaders = {
      'X-Slack-User': userId,
    }
    return this.client.apiCall(this.method, headers, args)
  }
}
