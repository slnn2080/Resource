import { Marking, Record } from "@/store/types/adapters/commonMarkingTimelineAdapter"
import { Message, WebRTCMessageGetAdapter, WebRTCMessageGetResponseResultItemType, } from '@/store/types/adapters/webrtcMessageAdapter'

/* eslint-disable camelcase */
export class TesterDetailAdapter {
  constructor(
    public userId: number = 0,
    public testId: number | null = null,
    public loginId: string = '',
    public exLoginId: string = '',
    public groupId: string = '',
    public group: string = '',
    public testName: string = '',
    public region: string = '',
    public testAt: string | null = null,
    public stopAt: string | null = null,
    public examName: string = '',
    public rExamName: string = '',
    public isMcStartup: boolean = false,
    public matchedAt: string | null = null,
    public authenticatedAt: string | null = null,
    public loginAt: string | null = null,
    public logoutAt: string | null = null,
    public aiNameMatch: number | null = null,
    public startupParameters: StartupParameters = new StartupParameters(),
    public headShotUri: string = '',
    public idCardUri: string = '',
    public markingSummaries: MarkingSummary[] = [],
    public markingTotalScore: number = 0,
    public markings: Marking[] = [],
    public aiMarkingSummaries: MarkingSummary[] = [],
    public aiMarkingTotalScore: number = 0,
    public aiMarkings: Marking[] = [],
    public records: RecordDetail[] = [],
    public messages: Message[] = [],
  ) {}

  /**
   *
   *
   */
  public static fromResponse(response: TesterDetailResponseResultType): TesterDetailAdapter {
    const r = new TesterDetailAdapter();

    r.userId = response.user_id;
    r.testId = response.test_id;
    r.loginId = response.login_id;
    r.exLoginId = response.ex_login_id;
    r.groupId = response.group_id;
    r.group = response.group;
    r.testName = response.test_name;
    r.region = response.region;
    r.testAt = response.test_at;
    r.stopAt = response.stop_at;
    r.examName = response.exam_name;
    r.rExamName = response.r_exam_name;
    r.isMcStartup = response.is_mc_startup;
    r.matchedAt = response.matched_at;
    r.authenticatedAt = response.authenticated_at;
    r.loginAt = response.login_at;
    r.logoutAt = response.logout_at;
    r.aiNameMatch = response.ai_namematch;
    r.startupParameters = StartupParameters.fromResponse(response.startup_parameters)
    r.headShotUri = response.head_shot_uri;
    r.idCardUri = response.id_card_uri;
    // 手動マーキング
    r.markingSummaries = (response.marking_summaries || []).map(v => {
      return {
        mark: v.mark,
        count: v.count,
      };
    });
    r.markingTotalScore = response.marking_total_score;
    r.markings = (response.markings || []).map(v => {
      return {
        markingAt: v.marking_at,
        url: v.url,
        mark: v.mark,
        recordId: v.record_id,
      };
    });
    // AIマーキング
    r.aiMarkingSummaries = (response.ai_marking_summaries || []).map(v => {
      return {
        mark: v.mark,
        count: v.count,
      };
    });
    r.aiMarkingTotalScore = response.ai_marking_total_score;
    r.aiMarkings = (response.ai_markings || []).map(v => {
      return {
        markingAt: v.marking_at,
        url: v.url,
        mark: v.mark,
        recordId: v.record_id,
      };
    });
    // レコード
    r.records = (response.records || []).map(v => {
      return {
        id: v.id,
        startAt: v.start_at as string,
        stopAt: v.stop_at as string,
        url: v.url,
        encodedAt: v.encoded_at,
        aiAnalysisBatchReflectedAt: v.ai_analysis_batch_reflected_at,
        aiAnalysisReflectedAt: v.ai_analysis_reflected_at,
        aiAnalysisBatchFlag: v.ai_analysis_batch_flag,
        aiAnalysisFlag: v.ai_analysis_flag,
        movieStatus: v.movie_status,
        detail: v.detail,
        playTimeFrom: v.play_time_from,
        playTimeTo: v.play_time_to,
      };
    });
    r.messages = (response.messages || []).map(v => WebRTCMessageGetAdapter.toMessage(v))

    return r;
  }
}

export class StartupParameters {
  public inServer: string = '';
  public target: string = '';
  public actor: number | null = null;
  public lang: string = '';
  public isMobile: boolean = false;
  public isMcStartup: boolean = false;
  public isProctor: boolean = false;
  public isAuth: boolean = false;
  public examUrl: string = '';
  public region: string = '';
  public examName: string = '';
  public examDatetime: string = '';
  public isVoiceRecording: boolean = false;
  public isRecord: boolean = false;
  public isSummary: boolean = false;
  public maxRectime: number | null = null;
  public matchingTimeout: number | null = null;
  public testerRetry: number | null = null;
  public checkerRetry: number | null = null;
  public webrtcTimeout: number | null = null;
  public intervaltime: number | null = null;
  public webrtcMaxTime: number | null = null;
  public isDebug: number | null = null;
  public isConv: number | null = null;
  public videoRecordingPreference: number | null = null;
  public voiceQualityPreference: number | null = null;
  public passwordUrl: string = '';
  public memo: string = '';
  public isAiAuth: number | null = null;
  public isAiFaildManual: number | null = null;
  public isAiIdcardRequest: number | null = null;
  public aiFaceRetry: number | null = null;
  public aiIdcardRetry: number | null = null;
  public aiAllRetry: number | null = null;
  public aiIdcardType: number[] = [];
  public aiNameMatch: number | null = null;
  public aiAfterAnalysis: number[] = [];

  /**
   *
   *
   * @return StartupParamerters
   */
  public static fromResponse(response: ResponseStartupParametersType): StartupParameters {
    const r = new StartupParameters()

    r.inServer                 = response.in_server as string
    r.target                   = response.target as string
    r.actor                    = response.actor as number | null
    r.lang                     = response.lang as string
    r.isMobile                 = response.is_mobile as boolean
    r.isMcStartup              = response.is_mc_startup as boolean
    r.isProctor                = response.is_proctor as boolean
    r.isAuth                   = response.is_auth as boolean
    r.examUrl                  = response.exam_url as string
    r.region                   = response.region as string
    r.examName                 = response.exam_name as string
    r.examDatetime             = response.exam_datetime as string
    r.isVoiceRecording         = response.is_voice_recording as boolean
    r.isRecord                 = response.is_record as boolean
    r.isSummary                = response.is_summary as boolean
    r.maxRectime               = response.max_rectime as number | null
    r.matchingTimeout          = response.matching_timeout as number | null
    r.testerRetry              = response.tester_retry as number | null
    r.checkerRetry             = response.checker_retry as number | null
    r.webrtcTimeout            = response.webrtc_timeout as number | null
    r.intervaltime             = response.intervaltime as number | null
    r.webrtcMaxTime            = response.webrtc_max_time as number | null
    r.isDebug                  = response.is_debug as number | null
    r.isConv                   = response.is_conv as number | null
    r.videoRecordingPreference = response.video_recording_preference as number | null
    r.voiceQualityPreference   = response.voice_quality_preference as number | null
    r.passwordUrl              = response.password_url as string
    r.memo                     = response.memo as string
    r.isAiAuth                 = response.is_ai_auth as number | null
    r.isAiFaildManual          = response.is_ai_faild_manual as number | null
    r.isAiIdcardRequest        = response.is_ai_idcard_request as number | null
    r.aiFaceRetry              = response.ai_face_retry as number | null
    r.aiIdcardRetry            = response.ai_idcard_retry as number | null
    r.aiAllRetry               = response.ai_all_retry as number | null
    r.aiIdcardType             = response.ai_idcard_type as number[]
    r.aiNameMatch              = response.ai_namematch as number | null
    r.aiAfterAnalysis          = response.ai_after_analysis as number[]

    return r
  }
}

export type MarkingSummary = {
  mark: string | null;
  count: number | null;
}

export type RecordDetail = Record & {
  encodedAt: string | null;
  aiAnalysisBatchReflectedAt: string | null;
  aiAnalysisReflectedAt: string | null;
  aiAnalysisBatchFlag: number;
  aiAnalysisFlag: number;
  movieStatus: number;
  detail: string;
}

export enum TesterDetailParamLatestMode {
  NONE = 0,
  LATEST = 1,
  EXAMINING_LATEST = 2,
};

export type TesterDetailRequestType = {
  user_id: number;
  test_id: number | null;
  latest_mode: TesterDetailParamLatestMode;
};

export type TesterDetailResponseType = {
  status: number;
  message: string;
  result: TesterDetailResponseResultType;
};

export type ResponseStartupParametersType = {
  in_server?: string,
  target?: string,
  actor?: number | null,
  lang?: string,
  is_mobile?: boolean,
  is_mc_startup?: boolean,
  is_proctor?: boolean,
  is_auth?: boolean,
  exam_url?: string,
  region?: string,
  exam_name?: string,
  exam_datetime?: string,
  is_voice_recording?: boolean,
  is_record?: boolean,
  is_summary?: boolean,
  max_rectime?: number | null,
  matching_timeout?: number | null,
  tester_retry?: number | null,
  checker_retry?: number | null,
  webrtc_timeout?: number | null,
  intervaltime?: number | null,
  webrtc_max_time?: number | null,
  is_debug?: number | null,
  is_conv?: number | null,
  video_recording_preference?: number | null,
  voice_quality_preference?: number | null,
  password_url?: string,
  memo?: string,
  is_ai_auth?: number | null,
  is_ai_faild_manual?: number | null,
  is_ai_idcard_request?: number | null,
  ai_face_retry?: number | null,
  ai_idcard_retry?: number | null,
  ai_all_retry?: number | null,
  ai_idcard_type?: number[],
  ai_namematch?: number | null,
  ai_after_analysis?: number[],
}

export type TesterDetailResponseResultType = {
  user_id: number;
  test_id: number | null;
  login_id: string;
  ex_login_id: string;
  group_id: string;
  group: string;
  test_name: string;
  region: string;
  test_at: string | null;
  stop_at: string | null;
  exam_name: string;
  r_exam_name: string;
  is_mc_startup: boolean;
  matched_at: string | null;
  authenticated_at: string | null;
  login_at: string | null;
  logout_at: string | null;
  ai_namematch: number | null;
  startup_parameters: ResponseStartupParametersType;
  head_shot_uri: string;
  id_card_uri: string;
  marking_summaries: {
    mark: string;
    count: number;
  }[];
  marking_total_score: number;
  markings: {
    marking_at: string;
    url: string;
    mark: string;
    record_id: number;
  }[];
  ai_marking_summaries: {
    mark: string;
    count: number;
  }[];
  ai_marking_total_score: number;
  ai_markings: {
    marking_at: string;
    url: string;
    mark: string;
    record_id: number;
  }[];
  records: {
    id: string;
    start_at: string | null;
    stop_at: string | null;
    url: string;
    encoded_at: string | null;
    ai_analysis_batch_reflected_at: string | null;
    ai_analysis_reflected_at: string | null;
    ai_analysis_batch_flag: number;
    ai_analysis_flag: number;
    movie_status: number;
    detail: string;
    play_time_from: string;
    play_time_to: string;
  }[];
  messages: WebRTCMessageGetResponseResultItemType[];
};
