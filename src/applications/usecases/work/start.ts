import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IUsersSetPresenceGateway } from '@/applications/repositories/slack/users/setPresence'
import { ACTION_GO_TO_WORK, ACTION_WORK_REMOTELY } from '@/constants/action'

export class WorkStartUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly usersSetPresenceRepos: IUsersSetPresenceGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    usersSetPresenceRepos: IUsersSetPresenceGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.usersSetPresenceRepos = usersSetPresenceRepos
  }

  public execute(channel_id: string, user_id: string) {
    // 対象のuserのログイン状態をautoに変更
    this.usersSetPresenceRepos.execute({ presence: 'auto' }, user_id)

    // 対象のchannelに対してメッセージ送信
    this.chatPostMessageRepos.execute({
      channel: channel_id,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '業務を開始します :sunny:',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '家で仕事する',
                emoji: true,
              },
              value: 'work-remotely',
              style: 'primary',
              action_id: ACTION_WORK_REMOTELY,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '会社に行く',
                emoji: true,
              },
              value: 'go-to-work',
              style: 'danger',
              action_id: ACTION_GO_TO_WORK,
            },
          ],
        },
      ],
    })
  }
}
