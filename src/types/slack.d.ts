// ----------------------------------------
// Interactivity & Shortcuts Payloads
// ----------------------------------------

type Payloads = {
  type: string
  user: User
  team: Team
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/shortcuts#fields
export type ShortcutsPayloads = Payloads & {
  type: 'shortcut'
  callback_id: string
  trigger_id: string
  token: string
  action_ts: string
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/block-actions#fields
export type BlockActionsPayloads = Payloads & {
  type: 'block_actions'
  trigger_id: string
  response_url: string
  message: any
  actions: (KnownAction & {
    block_id: string
    action_ts: string
  })[]
  token: string
  state: {
    values: any
  }
  channel: Channel
  container: MessageContainer
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/views#view_submission_fields
export type ViewSubmissionPayloads = Payloads & {
  type: 'view_submission'
  view: any
  hash: string
  response_urls: {
    block_id: string
    action_id: string
    channel_id: string
    response_url: string
  }[]
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
export type SlashCommandPayloads = {
  token: string
  command: string
  text: string
  team_id: string
  team_domain: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  api_app_id: string
  trigger_id: string
  response_url: string
  is_enterprise_install: 'true' | 'false'
}

type Team = {
  id: string
  domain: string
}

type Channel = {
  id: string
  name: string
}

type User = {
  id: string
  username: string
  name?: string
  team_id: string
}

type Container = MessageContainer | ViewContainer

type MessageContainer = {
  type: 'message'
  message_ts: string
  channel_id: string
  is_ephemeral: boolean
}

type ViewContainer = {
  type: 'view'
  view_id: string
}

// ----------------------------------------
// Block Kit Builder
// ----------------------------------------

/*
 * Block Elements
 */

// @see https://api.slack.com/reference/block-kit/composition-objects#text
type TextElement = PlainTextElement | MrkdwnElement

type PlainTextElement = {
  type: 'plain_text'
  text: string
  emoji?: boolean
}

type MrkdwnElement = {
  type: 'mrkdwn'
  text: string
  verbatim?: boolean
}

// @see https://api.slack.com/reference/block-kit/composition-objects#option
type Option = MrkdwnOption | PlainTextOption

type PlainTextOption = {
  text: PlainTextElement
  value: string
  description?: PlainTextElement
  url?: string
}

type MrkdwnOption = {
  text: MrkdwnElement
  value: string
  description?: PlainTextElement
  url?: string
}

// @see https://api.slack.com/reference/block-kit/composition-objects#option_group
type OptionGroup = {
  label: PlainTextElement
  options: Option[]
}

/*
 * Action Types
 */

type KnownAction = Button | Select

type Action = {
  type: string
  action_id: string
}

// @see https://api.slack.com/reference/block-kit/block-elements#button
type Button = Action & {
  type: 'button'
  text: PlainTextElement
  url?: string
  value?: string
  style?: 'primary' | 'danger'
  confirm?: Confirm
}

// @see https://api.slack.com/reference/block-kit/block-elements#select
type Select = StaticSelect

type StaticSelect = Action & {
  type: 'static_select'
  placeholder: PlainTextElement
  options: PlainTextOption[]
  option_groups?: {
    label: PlainTextElement
    options: PlainTextOption[]
  }[]
  initial_option?: PlainTextOption
  confirm?: Confirm
}

// @see https://api.slack.com/reference/block-kit/composition-objects#confirm
type Confirm = {
  title?: PlainTextElement
  text: TextElement
  confirm?: PlainTextElement
  deny?: PlainTextElement
  style?: 'primary' | 'danger'
}

/*
 * Block Types
 */

type KnownBlock = ActionsBlock | DividerBlock | SectionBlock | HeaderBlock

type Block = {
  type: string
  block_id?: string
}

type ActionsBlock = Block & {
  type: 'actions'
  elements: KnownAction[]
}

type DividerBlock = Block & {
  type: 'divider'
}

type SectionBlock = Block & {
  type: 'section'
  text?: TextElement
  fields?: TextElement[]
  accessory?: KnownAction
}

type HeaderBlock = Block & {
  type: 'header'
  text: PlainTextElement
}
