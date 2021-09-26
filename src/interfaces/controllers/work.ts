import { WorkEndUsacase } from '@/applications/usecases/work/end'
import { WorkSetLocateUsacase } from '@/applications/usecases/work/setLocate'
import { WorkStartUsacase } from '@/applications/usecases/work/start'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ChatPostMessageGateway } from '@/interfaces/gateways/slack/chat/postMessage'
import { ChatUpdateGateway } from '@/interfaces/gateways/slack/chat/update'
import { UsersSetPresence } from '@/interfaces/gateways/slack/users/setPresence'
import { UsersSetProfileGateway } from '@/interfaces/gateways/slack/users/setProfile'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'
import { BlockActionsPayloads, SlashCommandPayloads } from '@/types/slack'
import { UserStatusGateway } from '../gateways/spreadsheet/userStatus'
import { MessageGateway } from '../gateways/spreadsheet/message'

export class WorkController {
  private readonly slackClient: ISlackClient
  private readonly spredsheetClient: ISpreadsheetClient

  constructor(slackClient: ISlackClient, spredsheetClient: ISpreadsheetClient) {
    this.slackClient = slackClient
    this.spredsheetClient = spredsheetClient
  }

  public start(payloads: SlashCommandPayloads) {
    const usecase = new WorkStartUsacase(
      new ChatPostMessageGateway(this.slackClient),
      new UsersSetPresence(this.slackClient),
      new MessageGateway(this.spredsheetClient),
    )
    return usecase.execute(payloads.channel_id, payloads.user_id)
  }

  public setLocate(payloads: BlockActionsPayloads) {
    const usecase = new WorkSetLocateUsacase(
      new ChatPostMessageGateway(this.slackClient),
      new ChatUpdateGateway(this.slackClient),
      new UsersSetProfileGateway(this.slackClient),
      new UserStatusGateway(this.spredsheetClient),
      new MessageGateway(this.spredsheetClient),
    )

    if (payloads.actions[0].type !== 'button') {
      throw new Error(
        `Invalid action type detected (type ${payloads.actions[0].type})`,
      )
    }
    return usecase.execute(
      payloads.actions[0].value,
      payloads.channel.id,
      payloads.user.id,
      payloads.message.ts,
    )
  }

  public end(payloads: BlockActionsPayloads) {
    const usecase = new WorkEndUsacase(
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
      payloads.message.ts,
    )
  }
}
