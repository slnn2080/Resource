/* eslint-disable camelcase */

/** @enum  */
export enum WebRTCSendType {
  CHECKER = 0, // 「監視者」から「受験者」への送信
  TESTER  = 1, // 「受験者」から「監視者」への送信
}
/** @enum */
export enum WebRTCMessageType {
  IDENTIFICATION_TESTER  = 1, // 認証時「受験者」のメッセージ
  IDENTIFICATION_CHECKER = 2, // 認証時「監視者」のメッセージ
  MONITORING             = 3, // 監視時「監視者」のメッセージ
}
export type Message = {
  sendType: WebRTCSendType;
  messageType: WebRTCMessageType;
  message: string;
  createdAt: string;
}
export type WebRTCMessageRequestType = {
  messageType: number,
  message: string,
}


/*
 * POST
 */
export class WebRTCMessagePostAdapter {
  constructor(
  ) {}

  /**
   *
   *
   * @param {WebRTCMessagePostResponseType} response
   * @return {WebRTCMessagePostAdapter}
   */
  public static fromResponse(response: WebRTCMessagePostResponseType): WebRTCMessagePostAdapter {
    const r = new WebRTCMessagePostAdapter()

    return r
  }
}

export type WebRTCMessagePostRequestType = {
  send_type: WebRTCSendType;
  message_type: WebRTCMessageType;
  message: string;
}

export type WebRTCMessagePostResponseType = {
  status: number;
  message: string;
}

/*
 * GET
 */
export class WebRTCMessageGetAdapter {
  constructor(
    public messages: Message[] = [],
  ) {}

  /**
   *
   *
   * @param {WebRTCMessageGetResponseType} response
   * @return {WebRTCMessageGetAdapter}
   */
  public static fromResponse(response: WebRTCMessageGetResponseType): WebRTCMessageGetAdapter {
    const r = new WebRTCMessageGetAdapter()

    r.messages = response.result.map((item: WebRTCMessageGetResponseResultItemType) => WebRTCMessageGetAdapter.toMessage(item))

    return r
  }

  /**
   *
   *
   * @param {WebRTCMessageGetResponseResultItemType} item
   * @return {Message}
   */
  public static toMessage(item: WebRTCMessageGetResponseResultItemType): Message {
    return {
      sendType: item.send_type,
      messageType: item.message_type,
      message: item.message,
      createdAt: item.created_at,
    }
  }
}
export type WebRTCMessageGetRequestType = {
  tester_id: number;
}
export type WebRTCMessageGetResponseResultItemType = {
  message: string;
  send_type: WebRTCSendType;
  message_type: WebRTCMessageType;
  created_at: string;
}

export type WebRTCMessageGetResponseType = {
  status: number;
  message: string;
  result: WebRTCMessageGetResponseResultItemType[];
}
