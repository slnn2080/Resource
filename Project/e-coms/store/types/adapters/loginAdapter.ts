import StartupAdapter from '@/store/types/adapters/startupAdapter';

/* eslint-disable camelcase */
export class LoginAdapter {
  constructor(
    public accessToken: string | null = '',
    public examUserName: string | null = '',
    public loginId: string | null = '',
    public actor: number | null = null,

    public kicked: number | null = null,  // 受験者のみのパラメータ
    public groupId: string | null = null, // 受験者のみのパラメータ 
    public group: string | null = null,   // 受験者のみのパラメータ
  ) {}

  /**
   * アクセストークンを設定します
   *
   * @param {AccessToken} accessToken
   * @return {LoginResponseResultType}
   */
  public static fromAccessToken(accessToken: AccessToken): LoginAdapter {
    const r = new LoginAdapter()

    r.accessToken = accessToken.accessToken

    return r
  }

  /**
   * アクセストークンを設定します
   *
   * @param {AccessTokenWithActor} accessToken
   * @return {LoginResponseResultType}
   * @dependent 使ってはいけない
   */
  public static fromAccessTokenWithActor(accessToken: AccessTokenWithActor): LoginAdapter {
    const r = new LoginAdapter()

    r.accessToken = accessToken.accessToken
    r.actor = accessToken.actor

    return r
  }

  /**
   * レスポンスからログインアダプターを生成します
   *
   * @param {Result} response
   * @return {LoginResponseResultType}
   */
  public static fromResponse(response: LoginResponseResultType): LoginAdapter {
    const r = new LoginAdapter()

    r.accessToken  = response.access_token
    r.examUserName = response.exam_user_name
    r.loginId      = response.login_id
    r.actor        = window.parseInt(response.actor as any)
    r.kicked       = (response.kicked == null ? null : window.parseInt(response.kicked as any))
    r.groupId      = response.group_id
    r.group        = response.group

    return r
  }

  /**
   * スタートアップパラメータからログインアダプターを生成します
   *
   * @param {StartupAdapter} startup
   * @return {LoginAdapter}
   */
  public static fromStartupAdapter(startup: StartupAdapter): LoginAdapter {
    const r = new LoginAdapter()

    r.accessToken  = startup.accessToken
    r.examUserName = startup.examUserName
    r.loginId      = startup.loginId
    r.actor        = (startup.actor == null ? null : window.parseInt(startup.actor as any))
    r.kicked       = (startup.kicked == null ? null : window.parseInt(startup.kicked as any))
    r.groupId      = startup.groupId
    r.group        = startup.group

    return r
  }
}

export type AccessToken = {
  accessToken: string;
}
export type AccessTokenWithActor = {
  accessToken: string;
  actor: number;
}

type LoginResponseResultType = {
  access_token: string;
  exam_user_name: string;
  login_id: string;
  actor: number;

  kicked: number | null;
  group_id: string | null;
  group: string | null;
};

export type LoginRequestType = {
  login_id: string;
  password: string;
};

export type LoginResponseType = {
  status: number;
  message: string;
  result: LoginResponseResultType;
};

export type LogoutRequestType = {};

export type LogoutResponseType = {
  status: number;
  message: string;
};
