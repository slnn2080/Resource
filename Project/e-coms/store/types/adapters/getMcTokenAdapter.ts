/* eslint-disable camelcase */
export class GetMcTokenAdapter {
  constructor(
      public mode: GetMcTokenMode | null = null,
      public accessToken: string | null = '',
      public windowOpenURL: string | null = ''
  ) {}
}

/** @see srv/services/proctor/application/api/v1/lib/StartUp.inc */
export enum GetMcTokenMode {
  PROCTOR_TOKEN_MODE_ID = 1,
  MC_PLUS_STARTUP_MODE_ID = 2,
};

export type GetMcTokenRequestType = {
  mode: string;
};

export type GetMcTokenResponseType = {
  status: number;
  result: Result;
  message: string;
};

type Result = {
  access_token: string;
  window_open_url: string;
};
