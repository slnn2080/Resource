/* eslint-disable camelcase */

/**
 *
 *
 *
 */
export class TesterRecordingAdapter {
  constructor(
    public accessKeyId: string | null = '',
    public secretAccessKey: string | null = '',
    public sessionToken: string | null = '',
    public bucket: string | null = '',
    public key: string | null = '',
    public uploadId: string | null = '',
    public interval: number = 0
  ) {}
}

type Result = {
  access_key_id: string;
  secret_access_key: string;
  session_token: string;
  bucket: string;
  key: string;
  upload_id: string;
  interval: number
};

export type TesterRecordingRequestType = {
  method: string;
};

export type TesterRecordingResponseType = {
  status: number;
  result: Result;
  message: string;
};

/**
 *
 *
 */
export class TesterRecordingRecoveryAdapter {
  constructor(
  ) {}

  /**
   *
   *
   * @param {TesterRecordingRecoveryResponseType} response
   * @return {TesterRecordingRecoveryAdapter}
   */
  public static fromResponse(response: TesterRecordingRecoveryResponseType): TesterRecordingRecoveryAdapter {
    const r = new TesterRecordingRecoveryAdapter()

    return r
  }
}


export type TesterRecordingRecoveryRequestType = {
  key: string;
};

export type TesterRecordingRecoveryResponseType = {
  status: number;
  message: string;
  result?: any;
};

