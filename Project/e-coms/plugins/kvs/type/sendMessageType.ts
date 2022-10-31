import { Formatter } from '@/utils/Formatter';

export enum KvsDataType {
  COMMAND = 'command',
  MESSAGE = 'message',
};

export enum KvsCommand {
  MESSAGE_RECEIVED = '<<<MESSAGE_RECEIVED>>>',
  KICK_OUT = '<<<KICK_OUT>>>',
  BEFORE_CLOSE = '<<<BEFORE_CLOSE>>>',
  BEFORE_CLOSE_OK = '<<<BEFORE_CLOSE_OK>>>',
  IDENTIFICATION_AUTHENTICATING = '<<<AUTHENTICATING>>>',
  IDENTIFICATION_ACCEPTED = '<<<ACCEPTED>>>',
  IDENTIFICATION_REJECTED = '<<<REJECTED>>>'
}

type DataHeader = {
  dataType: KvsDataType;
};

export type CommandObject = DataHeader & {
  command: KvsCommand;
  data?: string; // 必要ならJSONでも突っ込む？
};

export type MessageObject = DataHeader & {
  uniqueKey: string;      // 
  message: string;        // メッセージ
  url: string | null;     // 不正報告画像 URL (監視者から受験者へ送るとき)
  loginId: string;        // ログインID
  domainName: string;     // プロクタードメイン名
};

/**
 * MessageObjectのuniqueKeyを生成するための関数
 *
 * @param {string} prefix
 * @return {string}
 */
let idCounter: number = 0
export function getMessageUniqueKey(prefix: string): string {
  const id = ++ idCounter
  const date = Formatter.date('yyyyMMddhhmmss', new Date())

  return `${prefix}_${id}_${date}`
}
