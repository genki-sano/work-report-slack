import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetPresenceGateway } from '@/applications/repositories/slack/users/setPresence'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import {
  IMessageGateway,
  MessageType,
} from '@/applications/repositories/spreadsheet/message'
import {
  IUserStatusGateway,
  UserStatusType,
} from '@/applications/repositories/spreadsheet/userStatus'
import { ACTION_COME_BACK_LUNCH_HOUSE } from '@/constants/action'
import { Profile } from '@/domains/profile'

export class LunchEndUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateRepos: IChatUpdateGateway
  private readonly usersSetPresenceRepos: IUsersSetPresenceGateway
  private readonly usersSetProfileRepos: IUsersSetProfileGateway
  private readonly userStatusRepos: IUserStatusGateway
  private readonly messageRepos: IMessageGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    chatUpdateRepos: IChatUpdateGateway,
    usersSetPresenceRepos: IUsersSetPresenceGateway,
    usersSetProfileRepos: IUsersSetProfileGateway,
    userStatusRepos: IUserStatusGateway,
    messageRepos: IMessageGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.chatUpdateRepos = chatUpdateRepos
    this.usersSetPresenceRepos = usersSetPresenceRepos
    this.usersSetProfileRepos = usersSetProfileRepos
    this.userStatusRepos = userStatusRepos
    this.messageRepos = messageRepos
  }

  public execute(
    actionId: string,
    channelId: string,
    userId: string,
    messageTs: string,
  ): void {
    // 対象のuserのログイン状態をautoに変更
    this.usersSetPresenceRepos.execute({ presence: 'auto' }, userId)

    // 対象のuserのステータスを選択された値に変更
    const userStatus =
      actionId === ACTION_COME_BACK_LUNCH_HOUSE
        ? UserStatusType.House
        : UserStatusType.Office
    const statusEmoji = this.userStatusRepos.getIcon(userStatus, userId)
    const statusText = this.userStatusRepos.getText(userStatus, userId)
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
            text: this.messageRepos.getText(MessageType.Back, userId),
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
            text: this.messageRepos.getText(MessageType.Lunch, userId),
          },
        },
      ],
    })
  }
}
