import { ExamProcess } from '@/store/enum/ExamProcess';

/* eslint-disable camelcase */
export class TestStatusAdapter {
  constructor(
  ) {}

  public static fromResponse(response: TestStatusResponseType): TestStatusAdapter {
    const r = new TestStatusAdapter()
    return r
  }
}

export type TestStatusRequestType = {
  loginId?: string;
  process: ExamProcess;
  eai: string;
  testName: string;
  region: string;
  groupId: string;
  group: string;
  termSetCode?: string;
};

export type TestStatusResponseType = {
  status: number;
  message: string;
  result: object;
};
