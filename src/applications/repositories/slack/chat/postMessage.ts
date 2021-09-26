import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'
import { KnownBlock } from '@/types/slack'

// @see https://api.slack.com/methods/chat.postMessage#args
export type ChatPostMessageArguments = WebAPICallOptions & {
  channel: string
  as_user?: boolean
  blocks?: KnownBlock[]
  container_id?: string
  file_annotation?: string
  icon_emoji?: any
  icon_url?: any
  link_names?: boolean
  mrkdwn?: boolean
  parse?: any
  reply_broadcast?: boolean
  text?: string
  thread_ts?: string
  unfurl_links?: boolean
  unfurl_media?: boolean
  username?: string
}

export type ChatPostMessageResult = WebAPICallResult

export interface IChatPostMessageGateway {
  execute(args: ChatPostMessageArguments): ChatPostMessageResult
}
