import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import { ACTION_GO_TO_LUNCH } from '@/constants/action'
import { Profile } from '@/domains/profile'

export class WorkSetLocateUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateRepos: IChatUpdateGateway
  private readonly usersSetProfileRepos: IUsersSetProfileGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    chatUpdateRepos: IChatUpdateGateway,
    usersSetProfileRepos: IUsersSetProfileGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.chatUpdateRepos = chatUpdateRepos
    this.usersSetProfileRepos = usersSetProfileRepos
  }

  public execute(
    selectValue: string | undefined,
    channelId: string,
    userId: string,
    messageTs: string,
  ) {
    // 対象のuserのステータスを選択された値に変更
    const statusEmoji = selectValue === 'work-remotely' ? ':house:' : ':office:'
    const statusText = selectValue === 'work-remotely' ? '在宅' : '出社'
    const statusExpiration = 0
    const profile = new Profile(statusEmoji, statusText, statusExpiration)
    this.usersSetProfileRepos.execute({ profile }, userId)

    // 対象のメッセージにスレッドを立ててメッセージ送信
    this.chatPostMessageRepos.execute({
      channel: channelId,
      thread_ts: messageTs,
      blocks: [
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '昼休憩にする',
                emoji: true,
              },
              value: 'go-to-lunch',
              action_id: ACTION_GO_TO_LUNCH,
            },
          ],
        },
      ],
    })

    // クリックしたメッセージの更新
    this.chatUpdateRepos.execute({
      channel: channelId,
      ts: messageTs,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '業務を開始します :sunny:',
          },
        },
      ],
    })
  }
}
