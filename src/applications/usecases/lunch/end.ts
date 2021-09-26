import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetPresenceGateway } from '@/applications/repositories/slack/users/setPresence'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import { Profile } from '@/domains/profile'

export class LunchEndUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateRepos: IChatUpdateGateway
  private readonly usersSetPresenceRepos: IUsersSetPresenceGateway
  private readonly usersSetProfileRepos: IUsersSetProfileGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    chatUpdateRepos: IChatUpdateGateway,
    usersSetPresenceRepos: IUsersSetPresenceGateway,
    usersSetProfileRepos: IUsersSetProfileGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.chatUpdateRepos = chatUpdateRepos
    this.usersSetPresenceRepos = usersSetPresenceRepos
    this.usersSetProfileRepos = usersSetProfileRepos
  }

  public execute(channelId: string, userId: string, messageTs: string) {
    // 対象のuserのログイン状態をautoに変更
    this.usersSetPresenceRepos.execute({ presence: 'auto' }, userId)

    // 対象のuserのステータスを選択された値に変更
    const statusEmoji = ':smile:'
    const statusText = '戻り'
    const statusExpiration = 0
    const profile = new Profile(statusEmoji, statusText, statusExpiration)
    this.usersSetProfileRepos.execute({ profile }, userId)

    // 対象のchannelに対してメッセージ送信
    this.chatPostMessageRepos.execute({
      channel: channelId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '戻りました！',
          },
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
            text: '昼休憩にしますー :woman-raising-hand:',
          },
        },
      ],
    })
  }
}
