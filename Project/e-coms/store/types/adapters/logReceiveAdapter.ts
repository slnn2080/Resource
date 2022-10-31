/* eslint-disable camelcase */
export class LogReceiveAdapter {
  constructor(
  ) {}
}

export const enum LogReceiveType {
  TRACE = 1,
  ERROR = 2,
  DEBUG = 3,
};

export const DETAILS_MAX_LENGTH = 1024;

export type LogReceiveRequestType = {
  type: number | LogReceiveType;
  path: string;
  module: string;
  location: string;
  details: string;
  detail: string;
  timestamp: string;
  tag1?: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  tag5?: string;
};

export type LogReceiveResponseType = {
  status: number;
  message: string;
  result?: {} | null;
} | null;
