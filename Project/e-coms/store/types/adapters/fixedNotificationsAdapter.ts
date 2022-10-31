/* eslint-disable camelcase */
export class FixedNotificationsAdapter {
  constructor(public fixedNotificationList: FixedNotification[] = []) {}
}

export type FixedNotification = {
  id: number;
  message: string;
  orderId: number;
};

type FixedNotificationsListResponseType = {
  id: number;
  message: string;
  order_id: number;
};

// マッチング処理 レスポンスパラメータ
export type FixedNotificationsResponseType = {
  status: number;
  result: FixedNotificationsListResponseType[];
  message: string;
};
