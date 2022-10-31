/* eslint-disable camelcase */
export class AccessLimitDeleteAdapter {
  constructor(
  ) {}
}

export type AccessLimitDeleteRequestType = number[];

export type AccessLimitDeleteResponseType = {
  status: number;
  message: string;
  result: AccessLimitDeleteRequestType | null;
};
