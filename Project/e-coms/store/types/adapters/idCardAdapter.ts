
export class IdCardAdapter {
  constructor(
    public status: number = 0,                                // ０：失敗、１：成功
    public process: number = 0,                               // 1：デバイスから取得した顔画像がダメ　2：身分証画像がダメ　０：それ以外
    public faceRetry: number = 0,                             // 顔画像送信APIリトライ数
    public idCardRetry: number = 0,                           // 身分証画像送信APIリトライ数
    public faceUrl: string = '',                              // 顔写真URL
    public idCardUrl: string = '',                             // IDカードURL
    public messages: { code: string; message: string }[] = [], // [{"code":返却コード, "message":"メッセージ"}]
    public updatedAt: number = 0                              // API取得時間
  ) {}
}

export type IdCardRequestType = {
  image: string;
  content_type: string;
};

type IdCardType = {
  status: number;
  process: number;
  face_retry: number;
  id_card_retry: number;
  messages: { code: string; message: string }[];
};

export type IdCardResponseType = {
  status: number;
  result: IdCardType;
  message: string;
};
