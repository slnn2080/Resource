/* eslint-disable camelcase */

export class TesterRecordUriAdapter {
  constructor(
    public id: number | null = null,
    public url: string | null = null,
  ) {}

  static fromResponse(response: TesterRecordUriResponseType): TesterRecordUriAdapter {
    const r = new TesterRecordUriAdapter()

    r.id = response.result.id
    r.url = response.result.url

    return r
  }
}
export type TesterRecordUriRequestType = {
  record_id: number;
}

export type TesterRecordUriResponseResultType = {
  id: number | null;
  url: string | null;
}

export type TesterRecordUriResponseType = {
  status: number;
  message: string;
  result: TesterRecordUriResponseResultType;
};
