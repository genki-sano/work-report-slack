import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'

// @see https://api.slack.com/methods/users.setPresence#args
export type UsersSetPresenceArguments = WebAPICallOptions & {
  presence: 'auto' | 'away'
}

export type UsersSetPresenceResult = WebAPICallResult

export interface IUsersSetPresenceGateway {
  execute(
    args: UsersSetPresenceArguments,
    userId: string,
  ): UsersSetPresenceResult
}
