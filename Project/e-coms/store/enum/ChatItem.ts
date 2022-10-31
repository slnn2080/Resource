import { MessageObject } from '@/plugins/kvs/type/sendMessageType';

/* eslint-disable prettier/prettier */

export enum ChatItemSender {
  PROCTOR = 'proctor',
  EXAMINEE = 'examinee',
}
export type ChatItem = {
  sender: ChatItemSender;
  elapsedTime: string | null; // [監視者専用] 送信時間等メッセージの負荷情報
  message: string;

  sendAt: Date;   // 送信時間
  sentAt: Date | null; // 送信完了時間
  hasError: boolean;

  relationalMessageObject: MessageObject;
}
