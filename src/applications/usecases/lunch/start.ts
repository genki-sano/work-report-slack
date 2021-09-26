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
import {
  ACTION_COME_BACK_LUNCH_HOUSE,
  ACTION_COME_BACK_LUNCH_OFFICE,
  ACTION_END_WORK,
} from '@/constants/action'
import { Profile } from '@/domains/profile'

export class LunchStartUsacase {
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
    channelId: string,
    userId: string,
    threadTs: string,
    messageTs: string,
  ) {
    // 対象のuserのログイン状態をawayに変更
    this.usersSetPresenceRepos.execute({ presence: 'away' }, userId)

    // 対象のuserのステータスを離席中に変更
    const userStatus = UserStatusType.Away
    const statusEmoji = this.userStatusRepos.getIcon(userStatus, userId)
    const statusText = this.userStatusRepos.getText(userStatus, userId)
    const statusExpiration = 0
    const profile = new Profile(statusEmoji, statusText, statusExpiration)
    this.usersSetProfileRepos.execute({ profile }, userId)

    // 対象のchannelに対してメッセージ送信
    // TODO: 戻るときに出社か在宅か選んでもらう
    this.chatPostMessageRepos.execute({
      channel: channelId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: this.messageRepos.getText(MessageType.Lunch, userId),
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '家で再開',
                emoji: true,
              },
              value: 'come-back-lunch',
              style: 'primary',
              action_id: ACTION_COME_BACK_LUNCH_HOUSE,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '会社で再開',
                emoji: true,
              },
              value: 'come-back-lunch',
              style: 'danger',
              action_id: ACTION_COME_BACK_LUNCH_OFFICE,
            },
          ],
        },
      ],
    })

    // 対象のスレッドに対してメッセージ送信
    this.chatPostMessageRepos.execute({
      channel: channelId,
      thread_ts: threadTs,
      blocks: [
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '今日は終わり',
                emoji: true,
              },
              value: 'end-work',
              action_id: ACTION_END_WORK,
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
            text: '昼休憩を取りました :+1:',
          },
        },
      ],
    })
  }
}
