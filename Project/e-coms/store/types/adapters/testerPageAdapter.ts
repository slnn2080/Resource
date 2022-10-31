/* eslint-disable camelcase */
import { Matching } from './matchingAdapter';
import { TesterAdapter } from '@/store/types/adapters/testerAdapter';
import { TesterRecordingAdapter } from '@/store/types/adapters/testerRecordingAdapter';
import { TesterState } from '@/store/enum/TesterState';
import { StepbarState } from '@/store/enum/StepbarState';
import { ChatItem } from '@/store/enum/ChatItem';
import { Marking, Record } from '@/store/types/adapters/commonMarkingTimelineAdapter';
import { KVSMaster } from '@/plugins/kvs/master';
import { DeviceState } from '@/store/enum/deviceState';

export class TesterPageAdapter {
  constructor(
    /*
     * 共通
     */
    // ステップバーステータス
    public stepbarState: StepbarState | null = StepbarState.ENV_SETTING,
    // ネットワークエラー
    public disconnect: boolean = false,
    public isAuthError: boolean = false,

    /*
     * 「環境設定」画面
     */
    // 試験利用規約同意
    public isExamTermAgree: boolean = false,
    // 利用規約既読
    public isProcterTermRead: boolean = false,
    // プロクター利用規約同意
    public isProcterTermAgree: boolean = false,
    // カメラ有効
    public enableCamera: DeviceState = DeviceState.BEFORE_CHECK,
    // マイク有効
    public enableMicrophone: DeviceState = DeviceState.BEFORE_CHECK,

    /*
     *「本人認証」画面
     */
    // 本人確認中
    public isIdentifyCheckPending: boolean = false,
    // 本人認証作業完了
    public isIdentityCheckFinished: boolean = false,
    // 本人認証失敗
    public isIdentifyCheckNG: boolean = false,
    // チャットアイテム一覧
    public chatItems: ChatItem[] = [],

    /*
     *「試験」&「試験終了」画面
     */
    //  受験システム(MC+ or 外部試験)にログイン済みか
    public isLoggedInTestSystem: boolean = false,
    // 受験者ステータス
    public testerState: TesterState | null = TesterState.LOGIN,
    // テスターステータス等
    public testerAdapter: TesterAdapter | null = null,
    // 録画ステータス等
    public testerRecordingAdapter: TesterRecordingAdapter | null = null,
    // マーキング情報
    public markingTotalScore: number = 0,
    public markings: Marking[] = [],
    public records: Record[] = [],

    /*
     *「AI本人認証」画面
     */
    public identityImage: string = '',
    public idImage: string = '',
    public countRetryNum: number = 0,
    public fixedStrAiIdentifyList: { str: string; check: boolean }[] = [],
    public noticeAiDisplay: { selectedStr: string; noticeType: number; retry?: number, limite?: number, failStr?: string } = {
      retry: undefined,
      limite: undefined,
      failStr: undefined,
      noticeType: 1,
      selectedStr: '',
    }
  ) {}
}

export type TesterConditions = {
  isDisconnect: boolean;
  // 試験状況
  isBeforeExam: boolean;
  isExaming: boolean;
  isInterruptionExam: boolean;
  isFinishExam: boolean;
  // 録画状況
  isBeforeRecording: boolean;
  isRecording: boolean;
  isAfterRecording: boolean;
}
