/* eslint-disable camelcase */
export class CheckersMonitoringAdapter {
  constructor(){}
}

export class Matching {
  public checker: Checker = {
    id: 0,
    loginId: null,
    exLoginId: '',
    adminName: '',
    target: '',
  };
  public testers: Tester[] = [];

  /**
   * APIのレスポンスからフロント内で使うためのMatchingオブジェクトを生成します。
   *
   * @param {MatchingResponseType} response
   * @return {Matching}
   */
  public static fromResponse(response: MatchingResponseType): Matching {
    const r = new Matching();

    r.checker = Checker.fromResponse(response.checker);
    r.testers = response.testers?.map(v => Tester.fromResponse(v))

    return r;
  }
}

export class Checker {
  public id: number = 0;
  public loginId: string | null = null;
  public exLoginId: string = '';
  public target: string = '';
  public adminName: string = '';

  /**
   * APIのレスポンスからフロント内で使うためのCheckerオブジェクトを生成します。
   *
   * @param {CheckerResponseType} response
   * @return {Checker}
   */
  public static fromResponse(response: CheckerResponseType): Checker {
    const r = new Checker();

    r.id = response.id;
    r.loginId = response.login_id;
    r.exLoginId = response.ex_login_id;
    r.target = response.target;
    r.adminName = response.admin_name;

    return r;
  }
}

export class Tester {
  public id: number = 0;
  public loginId: string | null = null;
  public exLoginId: string = '';
  public isMcStartup: boolean = false;
  public target: string = '';
  public examName: string = '';
  public status: number = 0;
  public rejected: boolean = false;
  public kicked: boolean = false;
  public examUrl: string = '';
  public startupParameters: {
    isAuth: boolean;
    isProctor: boolean;
    isRecord: boolean;
    isSummary: boolean;
    memo: string;
  } = {
    isAuth: false,
    isProctor: false,
    isRecord: false,
    isSummary: false,
    memo: '',
  };
  public matchingStatus: number = 0;

  /**
   * APIのレスポンスからフロント内で使うためのTesterオブジェクトを生成します。
   *
   * @param {TesterResponseType} response
   * @return {Tester}
   */
  public static fromResponse(response: TesterResponseType): Tester {
    const r = new Tester();

    r.id = response.id;
    r.loginId = response.login_id;
    r.exLoginId = response.ex_login_id;
    r.isMcStartup = response.is_mc_startup;
    r.target = response.target;
    r.examName = response.exam_name;
    r.status = response.status;
    r.rejected = response.rejected;
    r.kicked = response.kicked;
    r.examUrl = response.exam_url;
    r.startupParameters = {
      isAuth: response.startup_parameters?.is_auth,
      isProctor: response.startup_parameters?.is_proctor,
      isRecord: response.startup_parameters?.is_record,
      isSummary: response.startup_parameters?.is_summary,
      memo: response.startup_parameters?.memo,
    };
    r.matchingStatus = response.matching_status;

    return r;
  }
}

export type CheckerResponseType = {
  id: number;
  login_id: string | null;
  ex_login_id: string;
  target: string;
  admin_name: string;
}
export type TesterResponseType = {
  id: number;
  login_id: string | null;
  ex_login_id: string;
  exam_name: string;
  status: number;
  is_mc_startup: boolean;
  target: string;
  exam_url: string;
  rejected: boolean;
  kicked: boolean;
  startup_parameters: {
    is_auth: boolean;
    is_proctor: boolean;
    is_record: boolean;
    is_summary: boolean;
    memo: string;
  };
  matching_status: number;
}

export type MatchingResponseType = {
  checker: CheckerResponseType;
  testers: TesterResponseType[];
}

export type CheckersMonitoringResponseType = {
  status: number;
  message: string;
  result: {
    matchings: MatchingResponseType[],
    not_matchings: TesterResponseType[];
    kicked_users: TesterResponseType[];
  };
};
