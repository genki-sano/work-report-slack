import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import {
  IMessageGateway,
  MessageType,
} from '@/applications/repositories/spreadsheet/message'
import {
  IUserStatusGateway,
  UserStatusType,
} from '@/applications/repositories/spreadsheet/userStatus'
import { ACTION_GO_TO_LUNCH, ACTION_WORK_IN_HOUSE } from '@/constants/action'
import { Profile } from '@/domains/profile'

export class WorkSetLocateUsacase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateRepos: IChatUpdateGateway
  private readonly usersSetProfileRepos: IUsersSetProfileGateway
  private readonly userStatusRepos: IUserStatusGateway
  private readonly messageRepos: IMessageGateway

  constructor(
    chatPostMessageRepos: IChatPostMessageGateway,
    chatUpdateRepos: IChatUpdateGateway,
    usersSetProfileRepos: IUsersSetProfileGateway,
    userStatusRepos: IUserStatusGateway,
    messageRepos: IMessageGateway,
  ) {
    this.chatPostMessageRepos = chatPostMessageRepos
    this.chatUpdateRepos = chatUpdateRepos
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
    // 対象のuserのステータスを選択された値に変更
    const userStatus =
      actionId === ACTION_WORK_IN_HOUSE
        ? UserStatusType.House
        : UserStatusType.Office
    const statusEmoji = this.userStatusRepos.getIcon(userStatus, userId)
    const statusText = this.userStatusRepos.getText(userStatus, userId)
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
            text: this.messageRepos.getText(MessageType.Start, userId),
          },
        },
      ],
    })
  }
}
