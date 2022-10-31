/* eslint-disable camelcase */
/** APIのストア/APIの戻りPromise用 */
export class AnalysisRequestIndexApiAdapter {
  constructor(
    public analysisRequests: AnalysisRequest[] = [],
  ) {}

  public static fromResponse(response: AnalysisRequestIndexApiResponseType): AnalysisRequestIndexApiAdapter {
    const r = new AnalysisRequestIndexApiAdapter();

    r.analysisRequests = response.result.analysis_requests.map(v => AnalysisRequest.fromResponse(v));

    return r;
  }
}

/** AI解析情報DBテーブルをフロント側で管理するためのデータ構造 */
export class AnalysisRequest {
  constructor(
    public id: number = 0,
    public inseq: number = 0,
    public status: number = 0,
    public env: string = '',
    public result: string = '',
    public updatedAt: string = '',
    public createdAt: string = '',
  ) {}

  public static fromResponse(item: AnalysisRequestIndexApiResponseResultListItem): AnalysisRequest {
    return new AnalysisRequest(
      item.id,
      item.inseq,
      item.status,
      item.env,
      item.result,
      item.created_at,
      item.updated_at
    );
  }
}

/** APIリクエスト設定 */
export type AnalysisRequestIndexApiSettingType = {
  domain: string;
}
/** APIリクエスト */
export type AnalysisRequestIndexApiRequestType = {
  sort_key?: number | null;
  sort_order?: number | null;
};
/** APIリクエスト設定&APIリクエスト */
export type AnalysisRequestIndexApiSettingAndRequestType = {
  setting: AnalysisRequestIndexApiSettingType;
  request: AnalysisRequestIndexApiRequestType;
}

/** APIレスポンス - リストアイテム */
export type AnalysisRequestIndexApiResponseResultListItem = {
  id: number;
  inseq: number;
  status: number;
  env: string;
  result: string;
  updated_at: string;
  created_at: string;
};

/** APIレスポンス */
export type AnalysisRequestIndexApiResponseType = {
  status: number;
  message: string;
  result: {
    analysis_requests: AnalysisRequestIndexApiResponseResultListItem[];
  };
};
