/* eslint-disable camelcase */
/** APIのストア/APIの戻りPromise用 */
export class AnalysisRequestInitialParamApiAdapter {
  constructor(
    public domain: string = '',
    public env: string = '',
  ) {}

  public static fromResponse(response: AnalysisRequestInitialParamApiResponseType):AnalysisRequestInitialParamApiAdapter {
    const resp_res = response.result;

    const r = new AnalysisRequestInitialParamApiAdapter();
    r.domain = resp_res.domain;
    r.env = resp_res.env;

    return r;
  }
}

/** APIリクエスト */
export type AnalysisRequestInitialParamApiRequestType = {
};

/** APIレスポンス */
export type AnalysisRequestInitialParamApiResponseType = {
  status: number;
  message: string;
  result: {
    domain: string;
    env: string;
  };
};
