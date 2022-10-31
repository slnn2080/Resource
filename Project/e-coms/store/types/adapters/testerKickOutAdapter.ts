/* eslint-disable camelcase */
export class TesterKickOutAdapter {
  constructor() {}
}
export enum KickOutMethod {
  PUT = 'PUT',
  PUT_MYSELF = 'PUT_MYSELF',
  PUT_MYSELF_AI = 'PUT_MYSELF_AI',
  DELETE = 'DELETE',
  DISCONNECT = 'DISCONNECT',
}

export type TesterKickOutRequestType = {
  tester_id?: number;
  ex_login_id?: string;
  target?: string;
  method: KickOutMethod;
};

export type TesterKickOutResponseType = {
  status: number;
  message: string;
  result: {
  };
};
