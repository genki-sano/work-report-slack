import { LunchEndUsacase } from '@/applications/usecases/lunch/end'
import { LunchStartUsacase } from '@/applications/usecases/lunch/start'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ChatPostMessageGateway } from '@/interfaces/gateways/slack/chat/postMessage'
import { ChatUpdateGateway } from '@/interfaces/gateways/slack/chat/update'
import { UsersSetPresence } from '@/interfaces/gateways/slack/users/setPresence'
import { UsersSetProfileGateway } from '@/interfaces/gateways/slack/users/setProfile'
import { BlockActionsPayloads } from '@/types/slack'

export class LunchController {
  private readonly client: ISlackClient

  constructor(client: ISlackClient) {
    this.client = client
  }

  public start(payloads: BlockActionsPayloads) {
    const usecase = new LunchStartUsacase(
      new ChatPostMessageGateway(this.client),
      new ChatUpdateGateway(this.client),
      new UsersSetPresence(this.client),
      new UsersSetProfileGateway(this.client),
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
