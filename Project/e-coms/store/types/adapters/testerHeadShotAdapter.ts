import { Base64 } from 'aws-sdk/clients/ecr';

/* eslint-disable camelcase */
export class TesterHeadShotAdapter {
  constructor(
    public url: string | null = null,
  ) {}

  /**
   *
   *
   */
  public static fromPostResponse(response: TesterHeadShotPostResponseType): TesterHeadShotAdapter {
    const r = new TesterHeadShotAdapter()

    r.url = response.result.url

    return r
  }

  /**
   *
   *
   */
  public static fromGetResponse(response: TesterHeadShotGetResponseType): TesterHeadShotAdapter {
    const r = new TesterHeadShotAdapter()

    r.url = response.result.url

    return r
  }
}

/*
 * POST
 */
export type TesterHeadShotPostRequestType = {
  tester_id: number;
  image: Base64;
  content_type: string;
};

export type TesterHeadShotPostResponseType = {
  status: number;
  message: string;
  result: {
    url: string | null;
  },
};

/*
 * GET
 */
export type TesterHeadShotGetRequestType = {
  tester_id: number;
};

export type TesterHeadShotGetResponseType = {
  status: number;
  message: string;
  result: {
    url: string | null;
  },
};
