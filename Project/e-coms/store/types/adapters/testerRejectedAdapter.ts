/* eslint-disable camelcase */
export class TesterRejectedAdapter {
  constructor() {}
}

export type TesterRejectedRequestType = {
  testerId: number;
  method: string;
}

export type TesterRejectedResponseType = {
  status: number;
  message: string;
}
