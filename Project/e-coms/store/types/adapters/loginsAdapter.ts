/* eslint-disable camelcase */
export class LoginsAdapter {
  constructor(
    public page: number = 1,
    public pageCount: number = 0,
    public count: number = 0,
    public list: LoginsItem[] = [],
  ) {
  }

  /**
   * レスポンスを設定する
   *
   * @param {LoginsResponseResultType} response
   * @return {LoginsAdapter}
   */
  public static fromResponse(response: LoginsResponseResultType | null): LoginsAdapter {
    const r = new LoginsAdapter()

    if (response) {
      const response2 = response as LoginsResponseResultType
      r.count     = response2.count
      r.pageCount = response2.page_count
      r.page      = response2.page
      r.list      = response2.list.map((v) => {
        return {
          loginId:     v.login_id,
          exLoginId:   v.ex_login_id,
          groupId:     v.group_id,
          group:       v.group,
          actor:       v.actor,
          target:      v.target,
          isMcStartup: v.is_mc_startup,
          status:      v.status,
          kicked:      v.kicked,
          rejected:    v.rejected,
          updatedAt:   v.updated_at,
          examUserId:  v.exam_user_id,
        }
      })
    }

    return r
  }
}

export enum ActorKind {
  TESTER = 1,
  OTHER = 2,
  ALL = -1,
}
export enum SortKey {
  LOGIN_ID = 1,
  GROUP_ID = 2,
  ACTOR = 3,
  TARGET = 4,
  IS_MC_STARTUP = 5,
  STATUS = 6,
  KICKED = 7,
  REJECTED = 8,
  UPDATED_AT = 9,
}
export enum SortOrder {
  DESC = 0,
  ASC = 1,
}

export type LoginsItem = {
  loginId: string;
  exLoginId: string;
  groupId: string;
  group: string;
  actor: number;
  target: string;
  isMcStartup: number | null;
  status: number | null;
  kicked: number | null;
  rejected: number | null;
  updatedAt: string;
  examUserId: string | null;
}

export type LoginsRequestType = {
  actor_kind: ActorKind;
  page: number | null;
  sort_key: SortKey | null;
  sort_order: SortOrder | null;
};

export type LoginsResponseResultItemType = {
  login_id: string;
  ex_login_id: string;
  group_id: string;
  group: string;
  actor: number;
  target: string;
  is_mc_startup: number | null;
  status: number | null;
  kicked: number | null;
  rejected: number | null;
  updated_at: string;
  exam_user_id: string | null;
};

export type LoginsResponseResultType = {
  count: number;
  page_count: number;
  page: number;
  list: LoginsResponseResultItemType[];
};

export type LoginsResponseType = {
  status: number;
  message: string;
  result: LoginsResponseResultType | null;
};
