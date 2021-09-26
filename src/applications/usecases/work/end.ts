import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetPresenceGateway } from '@/applications/repositories/slack/users/setPresence'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import {
  IUserStatusGateway,
  UserStatusType,
} from '@/applications/repositories/spreadsheet/userStatus'
import { Profile } from '@/domains/profile'

export class WorkEndUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateRepos: IChatUpdateGateway
  private readonly usersSetPresenceRepos: IUsersSetPresenceGateway
  private readonly usersSetProfileRepos: IUsersSetProfileGateway
  private readonly userStatusRepos: IUserStatusGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    chatUpdateRepos: IChatUpdateGateway,
    usersSetPresenceRepos: IUsersSetPresenceGateway,
    usersSetProfileRepos: IUsersSetProfileGateway,
    userStatusRepos: IUserStatusGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.chatUpdateRepos = chatUpdateRepos
    this.usersSetPresenceRepos = usersSetPresenceRepos
    this.usersSetProfileRepos = usersSetProfileRepos
    this.userStatusRepos = userStatusRepos
  }

  public execute(channelId: string, userId: string, messageTs: string) {
    // 対象のuserのログイン状態をawayに変更
    this.usersSetPresenceRepos.execute({ presence: 'away' }, userId)

    // 対象のuserのステータスを業務終了に変更
    const statusEmoji = this.userStatusRepos.getIcon(UserStatusType.End)
    const statusText = this.userStatusRepos.getText(UserStatusType.End)
    // 明日0時までにする
    let nextday = new Date()
    nextday.setDate(nextday.getDate() + 1)
    nextday.setHours(0)
    nextday.setMinutes(0)
    nextday.setSeconds(0)
    nextday.setMilliseconds(0)
    const statusExpiration = Math.floor(nextday.getTime() / 1000)
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
            text: '業務終了します :end:',
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
            text: '業務終了しました :+1:',
          },
        },
      ],
    })
  }
}
