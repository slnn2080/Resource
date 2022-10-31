/* eslint-disable camelcase */

/**
 * 一覧のデータ
 */
export class CreateShortUrlSelectAdapter {
  constructor(
    public shortUrls: ShortUrl[] = [],
  ) {
  }

  /**
    * レスポンスからアダプターを生成する
    *
    * @param {CreateShortUrlSelectResponseType} response
    * @return {CreateShortUrlSelectAdapter}
    */
  public static fromResponse(response: CreateShortUrlSelectResponseType): CreateShortUrlSelectAdapter {
    const r = new CreateShortUrlSelectAdapter()

     // @ts-ignore
    r.shortUrls = response.result.map(v => ShortUrl.fromResponse(v));

    return r
  }
}

export class ShortUrl {
  constructor(
    public id: number = 0,
    public actor: number = 0,
    public target: string = '',
    public url_key: string = '',
    public param: string = '',
    public updatedAt: string = '',
    public createdAt: string = '',
  ) { }

  public static fromResponse(item: CreateShortUrlResponse): ShortUrl {
    return new ShortUrl(
      item.id,
      item.actor,
      item.target,
      item.url_key,
      item.param,
      item.created_at,
      item.updated_at
    );
  }
}

export type CreateShortUrlSelectRequestType = {
};

export type CreateShortUrlResponse = {
  id: number;
  actor: number;
  target: string;
  url_key: string;
  param: string;
  updated_at: string;
  created_at: string;
}

export type CreateShortUrlSelectResponseType = {
  status: number;
  message: string;
  result: {
    short_url: CreateShortUrlResponse[];
  };
};

/**
 * 新規作成
 */
export class CreateShortUrlUpdateAdapter {
  constructor(
  ) {
  }

  /**
   * レスポンスからアダプターを生成
   *
   * @param {CreateShortUrlUpdateResponseType} response
   * @return {CreateShortUrlUpdateAdapter}
   */
  public static fromResponse(response: CreateShortUrlUpdateResponseType): CreateShortUrlUpdateAdapter {
    const r = new CreateShortUrlUpdateAdapter()

    return r
  }
}

export type CreateShortUrlUpdateRequestType = {
};

export type CreateShortUrlUpdateResponseResultType = {
}

export type CreateShortUrlUpdateResponseType = {
  status: number;
  message: string;
  result: CreateShortUrlUpdateResponseResultType;
};

/**
 * 更新
 */
export class CreateShortUrlInsertAdapter {
  constructor(
  ) {
  }

  /**
   * レスポンスからアダプターを生成
   *
   * @param {CreateShortUrlInsertResponseType} response
   * @return {CreateShortUrlInsertAdapter}
   */
  public static fromResponse(response: CreateShortUrlInsertResponseType): CreateShortUrlInsertAdapter {
    const r = new CreateShortUrlInsertAdapter()

    return r
  }
}

export type CreateShortUrlInsertRequestType = {
};

export type CreateShortUrlInsertResponseResultType = {
}

export type CreateShortUrlInsertResponseType = {
  status: number;
  message: string;
  result: CreateShortUrlInsertResponseResultType;
};

/**
 * 更新
 */
export class CreateShortUrlDeleteAdapter {
  constructor(
  ) {
  }

  /**
   * レスポンスからアダプターを生成
   *
   * @param {CreateShortUrlDeleteResponseType} response
   * @return {CreateShortUrlDeleteAdapter}
   */
  public static fromResponse(response: CreateShortUrlDeleteResponseType): CreateShortUrlDeleteAdapter {
    const r = new CreateShortUrlDeleteAdapter()

    return r
  }
}

export type CreateShortUrlDeleteRequestType = {
};

export type CreateShortUrlDeleteResponseResultType = {
}

export type CreateShortUrlDeleteResponseType = {
  status: number;
  message: string;
  result: CreateShortUrlInsertResponseResultType;
};

// export class CreateShortUrlFormValues {
//   constructor(
//     public urlKey: string = '',
//     public actor: number = 1,
//     public lang: string = 'ja',
//     public is_mobile: number = 0,
//     public is_mc_startup: number = 1,
//     public is_auth: number = 1,
//     public exam_url: string | null = null,
//     public region: string | null = null,
//     public exam_name: string | null = null,
//     public exam_datetime: string | null = null,
//     public is_voice_recording: number = 1,
//     public is_record: number = 1, 
//     public is_summary: number = 1,
//     public max_rectime: number = 7200,
//     public matching_timeout: number = 5,
//     public tester_retry: number = 100,
//     public checker_retry: number = 100,
//     public webrtc_timeout: number = 30,
//     public intervaltime: number = 20,
//     public webrtc_max_time: number = 7200,
//     public is_debug: number = 0,
//     public is_conv: number = 1,
//     public video_recording_preference: number = 15,
//     public voice_quality_preference: number = 6,
//     public ai_after_analysis: number | null = null,
//     public is_forget_password: string | null = null,
//     public memo: string | null = null,
//     public is_ai_auth: number = 2,
//     public is_ai_faild_manual: number = 1,
//     public is_ai_idcard_request: number = 1,
//     public ai_face_retry: number = 3,
//     public ai_idcard_retry: number = 3,
//     public ai_all_retry: number = 3,
//     public ai_namematch: number = 75,
//     public ai_iccard_type: number | null = null,
//     public capture: number = 2,
//     public capturecheck: number = 1,
//     public capturedisplay: number = 1,
//   ) {}
// }
