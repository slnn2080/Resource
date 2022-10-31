/* eslint-disable camelcase */
export class TestPassAdapter {
  constructor(
    public status: number | null = 0,
  ) {}
}

export type SwitchTestPassResponseType = {
  status: number;
  message: string;
}

export type SwitchTestPassRequestType = {
  method: string;
  test_id: number;
}

export type GetTestPassRequestType = {
  testId: number;
}

export type GetTestPassResponseType = {
  status: number;
  message: string;
  result: Result;
}

type Result = {
  status: string;
}
