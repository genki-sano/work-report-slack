import { Profile } from '@/domains/profile'
import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'

// @see https://api.slack.com/methods/users.profile.set#args
export type UsersSetProfileArguments = WebAPICallOptions & {
  profile: Profile
  name?: string
  user?: string
  value?: string
}

export type UsersSetProfileResult = WebAPICallResult

export interface IUsersSetProfileGateway {
  execute(args: UsersSetProfileArguments, userId: string): UsersSetProfileResult
}
