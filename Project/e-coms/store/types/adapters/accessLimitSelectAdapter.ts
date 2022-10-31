/* eslint-disable camelcase */
export class AccessLimitSelectAdapter {
  constructor(
    public accessLimits: AccessLimitSelectResponseResultItemType[] = [],
  ) {
  }
}

export type AccessLimitSelectRequestType = {
};

export type AccessLimitSelectResponseResultItemType = {
  id: number;
  ip: string;
  domain: string;
  actor: number;
  server: string;
};

export type AccessLimitSelectResponseType = {
  status: number;
  message: string;
  result: AccessLimitSelectResponseResultItemType[] | null;
};
