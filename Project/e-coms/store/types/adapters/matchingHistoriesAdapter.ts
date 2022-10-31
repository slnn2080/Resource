/* eslint-disable camelcase */
export class MatchingHistoriesAdapter {
  constructor(
    public users: MatchingHistoriesUser[] = []
  ) {}

  static fromResponse(response: MatchingHistoriesResponseType): MatchingHistoriesAdapter {
    const r = new MatchingHistoriesAdapter()

    r.users = response.result.users.map((v) => {
      return {
        examUserId: v.exam_user_id,
        loginId: v.login_id,
        exLoginId: v.ex_login_id,
        examName: v.exam_name,
        status: v.status,
        statusString: v.status_string,
        updatedAt: v.updated_at,
        matchedAt: v.matched_at,
      }
    })

    return r
  }
}

export type MatchingHistoriesUser = {
  examUserId: number;
  loginId: number | null;
  exLoginId: string;
  examName: string;
  status: number;
  statusString: string;
  updatedAt: string;
  matchedAt: string;
}

export type MatchingHistoriesRequestType = {
};

export type MatchingHistoriesResponseUserType = {
  exam_user_id: number;
  login_id: number | null;
  ex_login_id: string;
  exam_name: string;
  status: number;
  status_string: string;
  updated_at: string;
  matched_at: string;
}
export type MatchingHistoriesResponseResultType = {
  users: MatchingHistoriesResponseUserType[];
}

export type MatchingHistoriesResponseType = {
  status: number;
  message: string;
  result: MatchingHistoriesResponseResultType;
};
