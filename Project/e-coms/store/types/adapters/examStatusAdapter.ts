import { ExamProcess } from '@/store/enum/ExamProcess';

/* eslint-disable camelcase */
export class ExamStatusAdapter {
  constructor(
  ) {}

  public static fromResponse(response: ExamStatusResponseType): ExamStatusAdapter {
    const r = new ExamStatusAdapter()
    return r
  }
}

export type ExamStatusRequestType = {
  login_id?: string;
  process: ExamProcess;
  eai: string;
};

export type ExamStatusResponseType = {
  status: number;
  message: string;
  result: object;
};
