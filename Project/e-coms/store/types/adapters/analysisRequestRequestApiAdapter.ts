/* eslint-disable camelcase */
/** APIのストア/APIの戻りPromise用 */
export class AnalysisRequestRequestApiAdapter {
  constructor(
    public message: string = ''
  ) {}
}

/** APIリクエスト */
export type AnalysisRequestRequestApiRequestType = {
  analysis_inseq: number;
  analysis_status: number;
  testers: number[];
};

/** APIレスポンス */
export type AnalysisRequestRequestApiResponseType = {
  status: number;
  message: string;
  result: {
  };
};
