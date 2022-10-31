/* eslint-disable camelcase */
export class MonitorActivateAdapter {
  constructor(
    public monitorId: number = 0,
    public activation: boolean = true,
  ) {}

  public static fromResponse(response: MonitorActivateResponseType): MonitorActivateAdapter {
    const r = new MonitorActivateAdapter()

    r.monitorId = response.result.monitor_id
    r.activation = response.result.activation

    return r
  }
}

export type MonitorActivateRequestType = {
  monitor_id: number; // 1~4: sub monitor number
  activation: boolean;
};
export type MonitorActivateResponseResultType = {
  monitor_id: number;
  activation: boolean;
};

// マッチング処理 レスポンスパラメータ
export type MonitorActivateResponseType = {
  status: number;
  message: string;
  result: MonitorActivateResponseResultType;
};
