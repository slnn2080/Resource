/* eslint-disable camelcase */

export class ManagementInitialParamAdapter {
  constructor(
    public origin: string = '',
    public domain: string = '',
  ) {}

  /**
   *
   *
   * @param {ManagementInitialParamResponseType} response
   * @return {ManagementInitialParamAdapter}
   */
  public static fromResponse(response: ManagementInitialParamResponseType):ManagementInitialParamAdapter {
    const r = new ManagementInitialParamAdapter();

    r.origin            = response.result.origin;
    r.domain            = response.result.domain;

    return r;
  }
}

/** APIリクエスト */
export type ManagementInitialParamRequestType = {
};

export type ManagementInitialParamResponseResultType = {
  origin: string;
  domain: string;
}

/** APIレスポンス */
export type ManagementInitialParamResponseType = {
  status: number;
  message: string;
  result: ManagementInitialParamResponseResultType;
};
