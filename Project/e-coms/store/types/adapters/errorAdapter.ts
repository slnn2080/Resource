import { EndpointType } from '@/store/const/endpoint';

/* eslint-disable camelcase */
export class ErrorAdapter {
  constructor(
    public hash: {[key:string]: ErrorStatus | null} = {},
  ) {}

  public static isErrorState(error: any) {
    try {
      return !!{}.hasOwnProperty.call(error, 'endpoint') && !!error.endpoint
    } catch (e) {
      return false
    }
  }
}

// エラー構造体
export type ErrorStatus = {
  endpoint: EndpointType;
  status: number;
  message: string;
  result?: null | undefined | { [key: string]: string | number | null } | {};
};
