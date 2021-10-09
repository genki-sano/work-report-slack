import {
  IUsersSetProfileGateway,
  UsersSetProfileArguments,
  UsersSetProfileResult,
} from '@/applications/repositories/slack/users/setProfile'
import {
  ISlackClient,
  WebAPICallHeaders,
} from '@/interfaces/gateways/slack/client'

type Compact<A> = { [K in keyof A]: A[K] }
type Overwrite<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
> = Compact<Omit<A, keyof B> & B>

export class UsersSetProfileGateway implements IUsersSetProfileGateway {
  private readonly client: ISlackClient
  private readonly method: string

  constructor(client: ISlackClient) {
    this.client = client
    this.method = 'users.profile.set'
  }

  public execute(
    args: UsersSetProfileArguments,
    userId: string,
  ): UsersSetProfileResult {
    const options: Overwrite<UsersSetProfileArguments, { profile: string }> = {
      ...args,
      profile: JSON.stringify({
        status_emoji: args.profile.status_emoji,
        status_text: args.profile.status_text,
        status_expiration: args.profile.status_expiration,
      }),
    }
    const headers: WebAPICallHeaders = {
      'X-Slack-User': userId,
    }
    return this.client.apiCall(this.method, headers, options, true)
  }
}
