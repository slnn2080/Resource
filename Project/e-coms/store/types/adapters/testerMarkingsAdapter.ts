/* eslint-disable camelcase */
export class TesterMarkingsAdapter {
  constructor(
    public testerId: number | null = 0,
    public mark: number | null = 0,
    public image: string | null = '',
    public contentType: string | null = '',
    public timeLag: number | null = 0,
    public alert: string = '',
    public url: string = ''
  ) {}
}

export type TesterMarkingsRequestType = {
  testerId: number;
  mark: number;
  image: string;
  contentType: string;
  timeLag: number;
  notification: number;
};

export type TesterMarkingsResponseType = {
  status: number;
  message: string;
  result: { alert: string; url: string };
};
