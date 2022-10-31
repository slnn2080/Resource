/* eslint-disable camelcase */
export class MarksAdapter {
  constructor(public markList: Marks[] = []) {}
}

export type Marks = { id: number; message: string; orderId: number; label: string; display: number };

type MarkListResponseType = {
  id: number;
  message: string;
  order_id: number;
  label: string;
  display: number;
};

// マッチング処理 レスポンスパラメータ
export type MarksResponseType = {
  status: number;
  result: MarkListResponseType[];
  message: string;
};
