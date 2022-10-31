/* eslint-disable camelcase */
export class TesterAdapter {
  constructor(
    public testerId: number = 0,
    public examName: string = '',
    public status: number = 0,
    public loginId: string = '',
    public authenticatedAt: string | null = '',
    public startupParameters: StartupParameters = new StartupParameters(),
    public rejected: number = 0,
    public testers: Tester[] = [],
  ) {}
}

class Tester {
  constructor(
    public testerId: number = 0,
    public examName: string = '',
    public status: number = 0,
    public loginId: string = '',
    public startupParameters: StartupParameters = new StartupParameters(),
  ) {}
}

export class StartupParameters {
  constructor(
    public isProctor: number = 0,
    public memo: string = '',
  ) {}
}

type Result = {
  tester_id: number;
  exam_name: string;
  status: number;
  login_id: string;
  authenticated_at: string | null;
  startup_parameters: {
    is_proctor: number;
    memo: string;
  };
  rejected: number;
  testers: TesterResult[];
};

type TesterResult = {
  tester_id: number;
  exam_name: string;
  status: number;
  login_id: string;
  startup_parameters: {
    is_proctor: number;
  };
};

/** 受験者情報取得処理リクエスト */
export type TesterRequestType = {
  tester_id: number;
};

/** 受験者情報取得処理レスポンス */
export type TesterResponseType = {
  // 処理結果ステータス
  status: number;
  result: Result;
  message: string;
};

/** 受験者情報更新リクエスト */
export type TesterStatusRequestType = {
  tester_id?: number;
  status: number;
};

/** 受験者情報更新レスポンス */
export type TesterStatusResponseType = {
  status: number;
  message: string;
};
