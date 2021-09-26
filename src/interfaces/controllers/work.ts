import { WorkEndUsacase } from '@/applications/usecases/work/end'
import { WorkSetLocateUsacase } from '@/applications/usecases/work/setLocate'
import { WorkStartUsacase } from '@/applications/usecases/work/start'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ChatPostMessageGateway } from '@/interfaces/gateways/slack/chat/postMessage'
import { ChatUpdateGateway } from '@/interfaces/gateways/slack/chat/update'
import { UsersSetPresence } from '@/interfaces/gateways/slack/users/setPresence'
import { UsersSetProfileGateway } from '@/interfaces/gateways/slack/users/setProfile'
import { BlockActionsPayloads, SlashCommandPayloads } from '@/types/slack'

export class WorkController {
  private readonly client: ISlackClient

  constructor(client: ISlackClient) {
    this.client = client
  }

  public start(payloads: SlashCommandPayloads) {
    const usecase = new WorkStartUsacase(
      new ChatPostMessageGateway(this.client),
      new UsersSetPresence(this.client),
    )
    return usecase.execute(payloads.channel_id, payloads.user_id)
  }

  public setLocate(payloads: BlockActionsPayloads) {
    const usecase = new WorkSetLocateUsacase(
      new ChatPostMessageGateway(this.client),
      new ChatUpdateGateway(this.client),
      new UsersSetProfileGateway(this.client),
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
      new ChatPostMessageGateway(this.client),
      new ChatUpdateGateway(this.client),
      new UsersSetPresence(this.client),
      new UsersSetProfileGateway(this.client),
    )
    return usecase.execute(
      payloads.channel.id,
      payloads.user.id,
      payloads.message.ts,
    )
  }
}
