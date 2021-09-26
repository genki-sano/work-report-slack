import { LunchEndUsacase } from '@/applications/usecases/lunch/end'
import { LunchStartUsacase } from '@/applications/usecases/lunch/start'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ChatPostMessageGateway } from '@/interfaces/gateways/slack/chat/postMessage'
import { ChatUpdateGateway } from '@/interfaces/gateways/slack/chat/update'
import { UsersSetPresence } from '@/interfaces/gateways/slack/users/setPresence'
import { UsersSetProfileGateway } from '@/interfaces/gateways/slack/users/setProfile'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'
import { BlockActionsPayloads } from '@/types/slack'
import { UserStatusGateway } from '../gateways/spreadsheet/userStatus'
import { MessageGateway } from '../gateways/spreadsheet/message'

export class LunchController {
  private readonly slackClient: ISlackClient
  private readonly spredsheetClient: ISpreadsheetClient

  constructor(slackClient: ISlackClient, spredsheetClient: ISpreadsheetClient) {
    this.slackClient = slackClient
    this.spredsheetClient = spredsheetClient
  }

  public start(payloads: BlockActionsPayloads) {
    const usecase = new LunchStartUsacase(
      new ChatPostMessageGateway(this.slackClient),
      new ChatUpdateGateway(this.slackClient),
      new UsersSetPresence(this.slackClient),
      new UsersSetProfileGateway(this.slackClient),
      new UserStatusGateway(this.spredsheetClient),
      new MessageGateway(this.spredsheetClient),
    )
    return usecase.execute(
      payloads.channel.id,
      payloads.user.id,
      payloads.message.thread_ts,
      payloads.message.ts,
    )
  }

  public end(payloads: BlockActionsPayloads) {
    const usecase = new LunchEndUsacase(
      new ChatPostMessageGateway(this.slackClient),
      new ChatUpdateGateway(this.slackClient),
      new UsersSetPresence(this.slackClient),
      new UsersSetProfileGateway(this.slackClient),
      new UserStatusGateway(this.spredsheetClient),
      new MessageGateway(this.spredsheetClient),
    )
    return usecase.execute(
      payloads.actions[0].action_id,
      payloads.channel.id,
      payloads.user.id,
      payloads.message.ts,
    )
  }
}
