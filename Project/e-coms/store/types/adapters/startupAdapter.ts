import { camelCase } from 'camel-case';

export default class StartupAdapter {
  constructor(
    public rawStartupUrl: string = '',

    public inServer: string = '',
    public target: string = '',
    public actor: number = 0, // TODO: J-Testingでのログインの場合、このパラメータが上書きされるので注意 本来は1 or 2のみを取る値であるが、上書きされた場合、他の値が来るので、常に1と比較しなければいけない
    public lang: string = 'ja',
    public isMobile: number = 0,
    public isMcStartup: number = 0,
    public isProctor: number = 0,
    public isAuth: number = 0,
    public examUrl: string = '',
    public region: string = '',
    public examName: string = '',
    public examDatetime: Date | any = null,
    public isVoiceRecording: number = 0,
    public isRecord: number = 0,
    public isSummary: number = 0,
    public selectedAnalysisTypes: string = '', // 1～4の数字がアンダースコアで連結された文字列。文字列に含まれる数字（例：1_3_4）によって、それぞれ以下の解析種類が選択されたことを意味する。1:eye_rot 2:other_person 3:people_num 4:voice
    public maxRectime: number = 0,
    public matchingTimeout: number = 0,
    public testerRetry: number = 0,
    public checkerRetry: number = 0,
    public webrtcTimeout: number = 0,
    public intervaltime: number = 0,
    public webrtcMaxTime: number = 0,
    public isDebug: IsDebug = 0, // 1-3:する 0:しない
    public isConv: number = 0,
    public videoRecordingPreference: number = 0,
    public voiceQualityPreference: number = 0,
    public passwordUrl: string = '',
    public memo: string = '',
    public isAiAuth: number = 1, // 1：監視者 2:AI
    public isAiFaildManual: number = 1, // 1:強制ログアウト　2:監視者 3:続行
    public isAiIdcardRequest: number = 0, // 1:する 0:しない
    public aiFaceRetry: number = 0,
    public aiIdcardRetry: number = 0,
    public aiAllRetry: number = 0,
    public aiIdcardType: number = 0, // 1：運転免許証、２：パスポート、３：マイナンバーカード
    public aiNameMatch: number = 0,

    public isForce: number = 0,
    public eai: string = '',
    public termSetCode: string = '',

    // このパラメータはJ-Testingのログインの際にmergeされるパラメータ 型情報が異なるので注意
    public accessToken: string | null= '',
    public examUserName: string | null = '',
    public loginId: string | null = '',
    public password: string | null = '',
    //public actor: string | null = '', // TODO:startupパラメータにも同名のパラメータがあるので注意 この値は、startupパラメータと異なり、1 or 2 以外も受け入れるので注意
    public kicked: string | null = '',
    public group: string | null = '',
    public groupId: string | null = '',
  ) {}

  /**
   * スタートアップパラメータ(キャメルケース)をスタートアップアダプターに変換します
   *
   * @param {RawStartupParameter} rawStartupParameter
   * @return {StartupAdapter}
   */
  public static fromRawStartupParameter(rawStartupParameter: RawStartupParameter): StartupAdapter {
    const r = new StartupAdapter()

    if (rawStartupParameter) {
      Object.entries(r).forEach(([k, v]) => {
        (r as any)[k] = (rawStartupParameter as any)[k] || v;
      });
    }

    return r
  }

  /**
   * スタートアップアダプターをスタートアップパラメータ(キャメルケース)に変換します
   *
   * @param {StartupAdapter} adapter
   * @return {RawStartupParameter}
   */
  public static toRawStartupParameter(adapter: StartupAdapter): RawStartupParameter {
    return { ...adapter }
  }

  /**
   * クエリをスタートアップパラメータ(キャメルケース)に変換します
   *
   * @param {string} query
   * @return {RawStartupParameter}
   * @see front/middleware/initCheck.ts getQuery()
   */
  public static toRawStartupParameterFromQuery(query: string): RawStartupParameter {
    const rawStartupParameter: RawStartupParameter = {}
    query
      .split('?')[1]
      .split('&')
      .forEach((v) => {
        // eslint-disable-next-line prefer-const
        let [key, value] = v.split('=');
        if (isNaN(+value)) {
          if (value === '%22%22' || value === '%27%27') {
            value = '';
          }
          rawStartupParameter[camelCase(key)] = decodeURIComponent(value);
        } else {
          rawStartupParameter[camelCase(key)] = +value;
        }
      });

    return rawStartupParameter
  }

  /**
   * J-Testingで起動したか調べます
   *
   * @param {StartupAdapter} startup
   * @return {boolean}
   */
  public static isJtStartUp(startup: StartupAdapter): boolean {
    return startup.loginId != null && startup.loginId != ''
  }
}

export type IsDebug = null | number; // 1-3:する 0:しない

/**
 * @type スタートアップパラメータ(キャメルケース) 
 *
 * この型は、StartupAdapterとは異なる使い方をするために定義してる。
 * sessionStorageに格納したり、URLパラメータとして渡すためにクラスインスタンスでは使いづらいため。
 * また、変換メソッド/パースメソッドについては、StartupAdapterに定義しているので、それ以外での変換を行ってはいけない
 */
export type RawStartupParameter = { [key: string]: any };

