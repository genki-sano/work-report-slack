import { IChatPostMessageGateway } from '@/applications/repositories/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/repositories/slack/chat/update'
import { IUsersSetPresenceGateway } from '@/applications/repositories/slack/users/setPresence'
import { IUsersSetProfileGateway } from '@/applications/repositories/slack/users/setProfile'
import { ACTION_COME_BACK_LUNCH, ACTION_END_WORK } from '@/constants/action'
import { Profile } from '@/domains/profile'

export class LunchStartUsacase {
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

  public execute(
    channelId: string,
    userId: string,
    threadTs: string,
    messageTs: string,
  ) {
    // 対象のuserのログイン状態をawayに変更
    this.usersSetPresenceRepos.execute({ presence: 'away' }, userId)

    // 対象のuserのステータスを離席中に変更
    const statusEmoji = ':curry:'
    const statusText = '離席中'
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
            text: '昼休憩にしますー :woman-raising-hand:',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '戻りました',
                emoji: true,
              },
              value: 'come-back-lunch',
              action_id: ACTION_COME_BACK_LUNCH,
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