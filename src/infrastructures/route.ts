import { Config } from '@/infrastructures/config'

// GASに設定した各種設定を取っておく
const config = new Config();

/**
 * Slack からの POST リクエストをハンドリングする関数
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @returns GoogleAppsScript.Content.TextOutput
 */
export const doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
  if (typeof e.postData === 'undefined') {
    throw new Error('invalid request');
  }

  if (e.postData.type === 'application/json') {
    // Events API (イベント API / URL 検証リクエスト)
    return executeEventApi(e);
  }

  if (e.postData.type === 'application/x-www-form-urlencoded') {
    if (typeof e.parameters.payload !== 'undefined') {
      // Interactivity & Shortcuts (ボタン操作やモーダル送信、ショートカットなど)
      return executeInteractivityAndShortcuts(e);
    }

    if (typeof e.parameters.command !== 'undefined') {
      // Slash Commands (スラッシュコマンドの実行)
      return executeSlashCommands(e);
    }
  }

  return ContentService.createTextOutput('');
}

/**
 * Events API (イベント API / URL 検証リクエスト)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @returns GoogleAppsScript.Content.TextOutput
 */
const executeEventApi = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
  const payload = JSON.parse(e.postData.contents);
  // Verification Token の検証
  if (payload.token !== config.legacyVerificationToken) {
    throw new Error(`Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`);
  }

  // Events API を有効にしたときの URL 検証リクエストへの応答
  if (typeof payload.challenge !== 'undefined') {
    return ContentService.createTextOutput(payload.challenge);
  }

  // -------------------------------------------------------------
  // TODO: ここにあなたの処理を追加します
  if (typeof payload.event.channel !== 'undefined') {
  }
  // -------------------------------------------------------------

  // 200 OK を返すことでペイロードを受信したことを Slack に対して伝える
  return ContentService.createTextOutput('');
}

/**
 * Interactivity & Shortcuts (ボタン操作やモーダル送信、ショートカットなど)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @returns GoogleAppsScript.Content.TextOutput
 *
 * @see https://api.slack.com/reference/interaction-payloads
 */
const executeInteractivityAndShortcuts = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
  const payload = JSON.parse(e.parameters.payload[0]);
  // Verification Token の検証
  if (payload.token !== config.legacyVerificationToken) {
    throw new Error(`Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`);
  }

  // -------------------------------------------------------------
  // TODO: ここにあなたの処理を追加します

  // グローバルショートカット
  if (payload.type === 'shortcut') {
    if (payload.callback_id === 'gas') {
      // Callback ID が gas のグローバルショートカットへの応答としてモーダルを開く例
      // callWebApi(token, 'views.open', {
      //   trigger_id: payload.trigger_id,
      //   user_id: payload.user.id,
      //   view: JSON.stringify(modalView)
      // });
    }

    return ContentService.createTextOutput('');
  }

  // メッセージショートカット
  if (payload.type === 'message_action') {
    if (payload.callback_id === 'gas-msg') {
      // Callback ID が gas-msg のメッセージショートカットへの応答として
      // response_url を使って返信を投稿する例（respond のコード例は次のコード例を参照）
      // respond(payload.response_url, 'Thanks for running a message shortcut!');
    }

    return ContentService.createTextOutput('');
  }

  // Block Kit (message 内の blocks) 内の
  // ボタンクリック・セレクトメニューのアイテム選択イベント
  if (payload.type === 'block_actions') {
    // console.log(`Action data: ${JSON.stringify(payload.actions[0])}`);
    return ContentService.createTextOutput('');
  }

  // モーダルの submit ボタンのクリックイベント
  if (payload.type === 'view_submission') {
    if (payload.view.callback_id === 'modal-id') {
      // モーダルの submit ボタンを押してデータ送信が実行されたときのハンドリング
      // const stateValues = payload.view.state.values;
      // console.log(`View submssion data: ${JSON.stringify(stateValues)}`);
      // 空のボディで応答したときはモーダルを閉じる
      // response_action で errors / update / push など指定も可能
      return ContentService.createTextOutput('');
    }

    return ContentService.createTextOutput('');
  }

  // モーダルの cancel ボタンのクリックイベント
  if (payload.type === 'view_closed') {
    return ContentService.createTextOutput('');
  }
  // -------------------------------------------------------------

  // 200 OK を返すことでペイロードを受信したことを Slack に対して伝える
  return ContentService.createTextOutput('');
}

/**
 * Slash Commands (スラッシュコマンドの実行)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @returns GoogleAppsScript.Content.TextOutput
 *
 * @see https://api.slack.com/interactivity/slash-commands
 */
const executeSlashCommands = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
  const payload: { [key: string]: any } = {}
  for (const [key, value] of Object.entries(e.parameters)) {
    payload[key] = value[0];
  }
  if (payload.token !== config.legacyVerificationToken) {
    // Verification Token の検証
    throw new Error(`Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`);
  }

  // -------------------------------------------------------------
  // TODO: ここにあなたの処理を追加します
  if (payload.command === '/gas') {
    // '/gas' というスラッシュコマンドのときの処理
    return ContentService.createTextOutput('Hi there!');
  }
  // -------------------------------------------------------------

  // 200 OK を返すことでペイロードを受信したことを Slack に対して伝える
  return ContentService.createTextOutput('');
}
