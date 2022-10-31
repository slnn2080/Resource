/* eslint-disable camelcase */
import moment from 'moment';
import { TesterState } from '@/store/enum/TesterState';
import { MatchingStatus } from '@/store/enum/MatchingStatus';
import { StartupParameters, ResponseStartupParametersType } from "@/store/types/adapters/testerDetailAdapter"

export class MatchingAdapter {
  constructor(
    public matchings: Matching[] = []
  ) {}
}

// マッチング情報配列構造体
export class Matching {
  public monitorId: number | null = null;
  public testerId: number = 0;
  public checkerId: number | null = null;
  public fileName: string = '';
  public matchingStatus: MatchingStatus = MatchingStatus.NONE;
  public loginId: number = 0;
  public exLoginId: string = '';
  public examName: string = '';
  public rExamName: string | null = null;
  public testerStatus: TesterState = TesterState.NONE;
  public rejected: number = 0;
  public kicked: number = 0;
  public matchingTotalTime: string = '0:00:00';
  public matchingConnectedTime: string = '0:00:00';
  public startupParameters: StartupParameters = new StartupParameters();
  public signalingChannel: SignalingChannel = new SignalingChannel();

  /**
   * レスポンスからマッチング情報を生成します
   *
   * @param {MatchingResultResponseType} response
   * @return Matching
   */
  public static fromResponse(response: MatchingResultResponseType): Matching {
    const r = new Matching()

    r.monitorId             = response.monitor_id
    r.testerId              = response.tester_id
    r.checkerId             = response.checker_id
    r.fileName              = response.file_name
    r.matchingStatus        = response.matching_status
    r.loginId               = response.login_id
    r.exLoginId             = response.ex_login_id
    r.examName              = response.exam_name
    r.rExamName             = response.r_exam_name
    r.testerStatus          = response.tester_status
    r.rejected              = response.rejected
    r.kicked                = response.kicked
    r.matchingTotalTime     = response.matching_total_time
    r.matchingConnectedTime = response.matching_connected_time,

    r.startupParameters     = StartupParameters.fromResponse(response.startup_parameters) 

    r.signalingChannel = new SignalingChannel()
    r.signalingChannel.region          = response.signaling_channel.region
    r.signalingChannel.accessKeyId     = response.signaling_channel.access_key_id
    r.signalingChannel.secretAccessKey = response.signaling_channel.secret_access_key
    r.signalingChannel.sessionToken    = response.signaling_channel.session_token
    r.signalingChannel.channelName     = response.signaling_channel.channel_name

    return r
  }

  /**
   * 比較します
   *
   * @param {Matching} l
   * @param {Matching} r
   * @return {boolean}
   */
  public static equals(l: Matching, r: Matching): boolean {
    if (l == r) {
      return true
    }
    return /*l.monitorId == r.monitorId &&*/ l.testerId == r.testerId /*&& l.matchingConnectedTime == r.matchingConnectedTime*/
  }

  /**
   * テスターユニークキーを生成します
   *
   * @param {Matching} matching
   * @return {string}
   */
  public static generateTesterUniqueKey(matching: Matching): string {
    //return `${matching.monitorId}-${matching.testerId}`
    //return `${matching.testerId}-${matching.matchingConnectedTime}`
    return `${matching.testerId}`
  }

  /**
   * 経過時間を生成します
   *
   * @param {Matching} matching
   * @return {string}
   */
  public static generateElapsedTime(matching: Matching | null): string {
    if (!matching || !matching.matchingConnectedTime) {
      return '--:--:--'
    }

    const elapsedTime = moment().diff(moment(matching.matchingConnectedTime, 'YYYY-MM-DD hh:mm:ss'), 'seconds');
    const range = moment.duration(elapsedTime, 'seconds');
    return moment(`${range.hours()}:${range.minutes()}:${range.seconds()}`, 'HH:mm:ss').format('HH:mm:ss')
  }

  /**
   * 最大時間を生成します
   *
   * @param {Matching} matching
   * @return {string}
   */
  public static generateTotalTime(matching: Matching | null): string {
    if (!matching || !matching.matchingTotalTime) {
      return '--:--:--'
    }

    return moment(moment().format('YYYY/MM/DD ' + matching.matchingTotalTime), 'YYYY/MM/DD hh:mm:ss').format('hh:mm:ss')
  }
}

// シグナリングチャネル情報配列構造体
export class SignalingChannel {
  public region: string = '';
  public accessKeyId: string = '';
  public secretAccessKey: string = '';
  public sessionToken?: string = undefined;
  public channelName: string = '';

  /**
   * 妥当か調べます
   *
   * @param {SignalingChannel} signalingChannel
   * @return {boolean}
   */
  public static isValid(signalingChannel: SignalingChannel): boolean {
    return !!(signalingChannel.region && signalingChannel.accessKeyId && signalingChannel.secretAccessKey && signalingChannel.channelName)
  }

  /**
   * 比較します
   *
   * @param {SignalingChannel} l
   * @param {SignalingChannel} r
   * @return {boolean}
   */
  public static equals(l: SignalingChannel, r: SignalingChannel): boolean {
    if (l == r) {
      return true
    }
    return l.region === r.region
      && l.accessKeyId === r.accessKeyId
      && l.secretAccessKey === r.secretAccessKey
      && l.sessionToken === r.sessionToken
      && l.channelName === r.channelName
  }
}

// マッチング情報返り値 配列構造体
export type MatchingResultResponseType = {
  monitor_id: number | null;
  tester_id: number;
  checker_id: number | null;
  file_name: string;
  matching_status: MatchingStatus;
  login_id: number;
  ex_login_id: string;
  exam_name: string;
  r_exam_name: string | null;
  tester_status: TesterState;
  rejected: number;
  kicked: number;
  matching_total_time: string;     // 全体時間
  matching_connected_time: string; // 経過時間
  startup_parameters: ResponseStartupParametersType;
  signaling_channel: {
    region: string;
    access_key_id: string;
    secret_access_key: string;
    session_token?: string;
    channel_name: string;
  };
};

export enum ChannelStatusForApi {
  OPEN = 'open',
  FAILED = 'failed',
  CLOSE = 'close',
  ERROR = 'error',
}
export enum MatchingCommand {
  RESET_SIGNALING_CHANNEL = 1,
}

// マッチング処理 リクエストパラメータ
export type MatchingDefaultRequestType = {
}
export type MatchingPostStatusRequestType = {
  tester_id: number;
  channel_status: ChannelStatusForApi;
}
export type MatchingCommandRequestType = {
  tester_id: number;
  matching_command: MatchingCommand;
}
export type MatchingRequestType = MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType

type MatchingResult = {
  matchings: MatchingResultResponseType[];
};

// マッチング処理 レスポンスパラメータ
export type MatchingResponseType = {
  status: number;
  message: string;
  result: MatchingResult;
};

export type DeleteMatchingRequestType = {
  tester_id: number;
}
export type DeleteMatchingResponseType = {
  status: number;
  message: string;
  result: null;
}

