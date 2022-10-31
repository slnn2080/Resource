/* eslint-disable camelcase */
export class MonitorActivateListAdapter {
  constructor(
    public monitors: number[] = []
  ) {}


  /**
   *
   *
   * @param {MonitorActivateListResponseType} response
   * @return {MonitorActivateListAdapter}
   */
  public static fromResponse(response: MonitorActivateListResponseType): MonitorActivateListAdapter {
    const r = new MonitorActivateListAdapter()

    r.monitors = response.result.monitors

    return r
  }
}

// マッチング処理 レスポンスパラメータ
export type MonitorActivateListResponseType = {
  status: number;
  result: { monitors: number[] };
  message: string;
};
