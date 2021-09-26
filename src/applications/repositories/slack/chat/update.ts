import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'
import { KnownBlock } from '@/types/slack'

// @see https://api.slack.com/methods/chat.update#args
export type ChatUpdateArguments = WebAPICallOptions & {
  channel: string
  ts: string
  as_user?: boolean
  attachments?: any
  blocks?: KnownBlock[]
  file_ids?: string[]
  link_names?: boolean
  parse?: any
  reply_broadcast?: boolean
  text?: string
}

export type ChatUpdateResult = WebAPICallResult

export interface IChatUpdateGateway {
  execute(args: ChatUpdateArguments): ChatUpdateResult
}
