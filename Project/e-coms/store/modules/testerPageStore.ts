import { GetterTree, ActionTree, MutationTree } from 'vuex';
import VueRouter from 'vue-router';
import { TestMarkingsAdapter } from '@/store/types/adapters/testMarkingsAdapter';
import { ChatItem } from '@/store/enum/ChatItem';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import { TesterAdapter } from '@/store/types/adapters/testerAdapter';
import {
  TesterRecordingAdapter,
  TesterRecordingRecoveryAdapter,
  TesterRecordingRecoveryRequestType,
} from '@/store/types/adapters/testerRecordingAdapter';
import { GetMcTokenAdapter, GetMcTokenRequestType } from '@/store/types/adapters/getMcTokenAdapter';
import { TesterState } from '@/store/enum/TesterState';
import { StepbarState } from '@/store/enum/StepbarState';
import {
  ExamStatusAdapter,
  ExamStatusRequestType,
  ExamStatusResponseType
} from '@/store/types/adapters/examStatusAdapter';
import {
  TestStatusAdapter,
  TestStatusRequestType,
  TestStatusResponseType
} from '@/store/types/adapters/testStatusAdapter';
import * as testerPageTypes from '@/store/types/testerPageType';
import * as testerTypes from '@/store/types/testerType';
import * as testMarkingsTypes from '@/store/types/testMarkingsType';
import * as testerRecordingTypes from '@/store/types/testerRecordingType';
import * as examStatusTypes from '@/store/types/examStatusType';
import * as testStatusTypes from '@/store/types/testStatusType';
import {
  GetMcTokenMode,
} from '@/store/types/adapters/getMcTokenAdapter';
import * as getMcTokenTypes from '@/store/types/getMcTokenType';
import * as rootTypes from '@/store/types/rootType';
import * as webrtcMessageTypes from '@/store/types/webrtcMessageType';
import * as aiAuthStatusTypes from '@/store/types/aiAuthStatusType';
import * as faceTypes from '@/store/types/faceType';
import * as idCardTypes from '@/store/types/idCardType';
import { DeviceState } from '@/store/enum/deviceState';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LanguageEnum } from '@/store/enum/language';
import {
  WebRTCMessagePostAdapter,
  WebRTCMessagePostRequestType,
  WebRTCMessageRequestType,
} from '@/store/types/adapters/webrtcMessageAdapter';
import { AiAuthStatusAdapter } from '@/store/types/adapters/aiAuthStatusAdapter';
import { FaceAdapter } from '@/store/types/adapters/faceAdapter';
import { IdCardAdapter } from '@/store/types/adapters/idCardAdapter';
import { ErrorAdapter, ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TesterPageAdapter();
};

type testerPage = ReturnType<typeof state>;

const getters: GetterTree<testerPage, testerPage> = {
// 共通
  [testerPageTypes.GETTER_TESTER_PAGE](state: testerPage) {
    return { ...state };
  },
  /**
   * ネットワークエラーフラグを取得します
   *
   * @param {testerPage} state
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_DISCONNECT](state: testerPage): boolean {
    return state.disconnect
  },
  /**
   * 認証エラーか調べます
   *
   * @param {testerPage} state
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_AUTH_ERROR](state: testerPage): boolean {
    return state.isAuthError
  },
// 「環境設定」画面
// 「本人認証」画面
  /**
   * 認証中か調べます
   *
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_AUTHENTICATING](state: testerPage): boolean {
    return state.isIdentifyCheckPending
  },
  /**
   * 認証が承認されたか調べます
   *
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_ACCEPTED](state: testerPage): boolean {
    return (
      state.isIdentifyCheckPending &&
      state.isIdentityCheckFinished &&
      !state.isIdentifyCheckNG
    )
  },
  /**
   * 認証が拒否されたか調べます
   *
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_REJECTED](state: testerPage): boolean {
    return (
      state.isIdentifyCheckPending &&
      state.isIdentityCheckFinished &&
      state.isIdentifyCheckNG
    )
  },
  /**
   * チャットアイテム一覧を取得します
   *
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_GET_CHAT_ITEMS](state: testerPage): ChatItem[] {
    return state.chatItems
  },
// 「試験」&「試験終了」画面
  /**
   * 受験システム(MC+ or 外部試験)にログイン済みかのフラグを取得します
   *
   * @param {testerPage} state
   * @return {boolean}
   */
  [testerPageTypes.GETTER_TESTER_PAGE_IS_LOGGED_IN_TEST_SYSTEM](state: testerPage): boolean {
    return state.isLoggedInTestSystem
  },
// AI本人認証
};

const mutations: MutationTree<testerPage> = {
// 共通
  // ステップバー状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_STEPBAR_STATE](state: testerPage, payload: StepbarState) {
    state.stepbarState = payload;
  },
  /**
   * ネットワークエラーフラグを設定します
   *
   * @param {testerPage} state
   * @param {boolean} payload
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_DISCONNECT](state: testerPage, payload: boolean) {
    state.disconnect = payload;
  },
  /**
   * 認証エラーを設定します
   *
   * @param {testerPage} state
   * @param {boolean} isAuthError
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_AUTH_ERROR](state: testerPage, isAuthError: boolean) {
    state.isAuthError = isAuthError
  },
// 「環境設定」画面
  // 試験利用規約同意状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_EXAM_TERM_AGREE](state: testerPage, payload: boolean) {
    state.isExamTermAgree = payload;
  },
  // プロクター利用規約既読状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_PROCTER_TERM_READ](state: testerPage, payload: boolean) {
    state.isProcterTermRead = payload;
  },
  // プロクター利用規約同意状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_PROCTER_TERM_AGREE](state: testerPage, payload: boolean) {
    state.isProcterTermAgree = payload;
  },
  // カメラ状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_ENABLE_CAMERA](state: testerPage, payload: DeviceState) {
    state.enableCamera = payload;
  },
  // マイク状態の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_ENABLE_MICROPHONE](state: testerPage, payload: DeviceState) {
    state.enableMicrophone = payload;
  },
// 「本人認証」画面
  /**
   * 本人認証状態の確認中更新
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_AUTHENTICATING](state: testerPage) {
    state.isIdentifyCheckPending = true;
    state.isIdentityCheckFinished = false;
    state.isIdentifyCheckNG = false;
  },
  /**
   * 本人認証状態の作業完了更新
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_ACCEPTED](state: testerPage) {
    state.isIdentifyCheckPending = true;
    state.isIdentityCheckFinished = true;
    state.isIdentifyCheckNG = false;
  },
  /**
   * 本人認証状態の失敗時更新
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_REJECTED](state: testerPage) {
    state.isIdentifyCheckPending = true;
    state.isIdentityCheckFinished = true;
    state.isIdentifyCheckNG = true;
  },
  /**
   * チャットアイテムを追加します
   *
   * @param {testerPage} state
   * @return {ChatItem} payload
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_ADD_CHAT_ITEM](state: testerPage, payload: ChatItem) {
    state.chatItems.unshift(payload)
  },
// 「試験」&「試験終了」画面
  // 受験者ステータスの更新処理
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER_STATE](state: testerPage, payload: TesterState) {
    state.testerState = payload;
  },
  // 受験者情報取得情報の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER](state: testerPage, payload: TesterAdapter) {
    state.testerState = payload.status;
  },
  /**
   * 受験システム(MC+ or 外部試験)にログイン済みかのフラグを設定する
   *
   * @param {testerPage} statue
   * @param {boolean} payload
   */
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_LOGGED_IN_TEST_SYSTEM](state: testerPage, payload: boolean) {
    state.isLoggedInTestSystem = payload
  },
  // 録画開始処理
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER_RECORDING_START](state: testerPage, payload: TesterRecordingAdapter) {
    state.testerRecordingAdapter = payload
  },
  // 録画終了処理
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER_RECORDING_END](state: testerPage, payload: TesterRecordingAdapter) {
  },
  // 録画ステータス取得
  [testerPageTypes.MUTATION_TESTER_PAGE_TESTER_RECORDING](state: testerPage, payload: TesterRecordingAdapter) {
    state.testerRecordingAdapter = payload
  },
  // 不正疑惑行為サマリ情報の更新
  [testerPageTypes.MUTATION_TESTER_PAGE_SET_TEST_MARKINGS](state: testerPage, payload: TestMarkingsAdapter) {
    state.markings = payload.markings;
    state.markingTotalScore = payload.markingTotalScore;
    state.records = payload.records;
  },
// AI本人認証
  [testerPageTypes.MUTATION_TESTER_PAGE_IDENTITYIMAGE](state: testerPage, payload: string) {
    state.identityImage = payload;
  },
  [testerPageTypes.MUTATION_TESTER_PAGE_ID_IMAGE](state: testerPage, payload: string) {
    state.idImage = payload;
  },
  [testerPageTypes.MUTATION_TESTER_PAGE_FIXED_STR_AI_DISPLAY](state: testerPage, payload: { str: string; check: boolean }[]) {
    state.fixedStrAiIdentifyList = payload;
  },
  [testerPageTypes.MUTATION_TESTER_PAGE_NOTICE_AI_DISPLAY](
    state: testerPage,
    payload: { selectedStr: string; noticeType: number; retry?: number; limite?: number; failStr?: string }
  ) {
    state.noticeAiDisplay.selectedStr = payload.selectedStr;
    state.noticeAiDisplay.limite = payload.limite;
    state.noticeAiDisplay.noticeType = payload.noticeType;
    state.noticeAiDisplay.retry = payload.retry;
    state.noticeAiDisplay.failStr = payload.failStr;
  },
  [testerPageTypes.MUTATION_TESTER_PAGE_COUNT_RETRY_NUM](state: testerPage, payload: number) {
    // state.countRetryNum = state.countRetryNum + payload;
    state.countRetryNum = payload;
  }
};

const actions: ActionTree<testerPage, testerPage> = {
// 共通
  // Stepbar 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE](context, payload: StepbarState) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_STEPBAR_STATE, payload);
  },
  /**
   * ネットワークエラーフラグを設定します
   *
   * @param {Context} context
   * @param {boolean} payload
   */
  [testerPageTypes.ACTION_TESTER_PAGE_SET_DISCONNECT](context, payload: boolean) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_DISCONNECT, payload);
  },
  [testerPageTypes.ACTION_TESTER_PAGE_POST_WEBRTC_MESSAGE](context, payload: WebRTCMessagePostRequestType): Promise<WebRTCMessagePostAdapter> {
    return context.dispatch(webrtcMessageTypes.ACTION_WEBRTC_MESSAGE_POST, payload);
  },
// 「環境設定」画面
  // 受験利用規約同意 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_EXAM_TERM_AGREE](context, payload: boolean) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_EXAM_TERM_AGREE, payload);
  },
  // プロクター利用規約 既読処理
  [testerPageTypes.ACTION_TESTER_PAGE_PROCTER_TERM_READ](context, payload: boolean) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_PROCTER_TERM_READ, payload);
  },
  // プロクター利用規約同意 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_PROCTER_TERM_AGREE](context, payload: boolean) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_PROCTER_TERM_AGREE, payload);
  },
  // カメラ状態 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_ENABLE_CAMERA](context, payload: DeviceState) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_ENABLE_CAMERA, payload);
  },
  // マイク状態 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_ENABLE_MICROPHONE](context, payload: DeviceState) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_ENABLE_MICROPHONE, payload);
  },
// 「本人認証」画面
  // 本人認証状態の確認中 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_AUTHENTICATING](context) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_AUTHENTICATING);
  },
  // 本人認証状態の作業完了 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_ACCEPTED](context) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_ACCEPTED);
  },
  // 本人認証状態の失敗時 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_REJECTED](context) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_CHANGE_IDENTIFICATION_REJECTED);
  },
  /**
   * チャットアイテムを追加します
   *
   * @param {Context} context
   * @param {ChatItem} payload
   */
  [testerPageTypes.GETTER_TESTER_PAGE_ADD_CHAT_ITEM](context, payload: ChatItem) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_ADD_CHAT_ITEM, payload)
  },
// 「試験」&「試験終了」画面
  // 受験者ステータス 更新処理
  [testerPageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE](context, payload: TesterState): Promise<boolean> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testerTypes.ACTION_TESTER_STATUS, { status: payload })
        .then(() => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER_STATE, payload);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 受験者情報取得処理
  [testerPageTypes.ACTION_TESTER_PAGE_GET_TESTER](context): Promise<number> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testerTypes.ACTION_TESTER)
        .then((testerAdapter: TesterAdapter) => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER, testerAdapter)
          resolve(testerAdapter.status)
        })
        .catch((e: any) => {
          if (
            ErrorAdapter.isErrorState(e)
            && (e.status == 401)
          ) {
            // 認証エラー
            context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_AUTH_ERROR, true)
          }
          reject(e)
        })
    });
  },
  /**
   * 受験システムにログインします(MC+)
   *
   * @param {Context} context
   * @param {GetMcTokenMode} mode
   * @return {Promise<GetMcTokenAdapter>}
   * @see store/types/testerPageType.ts ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_MC
   * @see store/types/testerPageType.ts ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_OTHER
   */
  [testerPageTypes.ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_MC](context, mode: GetMcTokenMode): Promise<GetMcTokenAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(getMcTokenTypes.ACTION_GET_MC_TOKEN, mode)
      .then((adapter: GetMcTokenAdapter) => {
        context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_LOGGED_IN_TEST_SYSTEM, true)
        resolve(adapter)
      })
      .catch(reject)
    })
  },
  /**
   * 受験システムにログインします(外部試験)
   *
   * @param {Context} context
   * @return {Promise<{}>}
   * @see store/types/testerPageType.ts ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_MC
   * @see store/types/testerPageType.ts ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_OTHER
   */
  [testerPageTypes.ACTION_TESTER_PAGE_GET_ACCESS_TOKEN_FOR_OTHER](context): Promise<{}> {
    return new Promise((resolve, reject) => {
      // nop 外部試験の場合ログイン処理はありません
      context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_LOGGED_IN_TEST_SYSTEM, true)
      resolve({})
    })
  },
  // 試験開始・終了処理（MC+）
  [testerPageTypes.ACTION_TESTER_PAGE_CHANGE_EXAM_STATUS](context, payload: ExamStatusRequestType) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(examStatusTypes.ACTION_CHANGE_EXAM_STATUS, payload)
        .then((adapter: ExamStatusAdapter) => {
          resolve(adapter)
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 試験開始・終了処理（外部試験）
  [testerPageTypes.ACTION_TESTER_PAGE_CHANGE_TEST_STATUS](context, payload: TestStatusRequestType) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testStatusTypes.ACTION_CHANGE_TEST_STATUS, payload)
        .then((adapter: TestStatusAdapter) => {
          resolve(adapter);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 録画開始処理
  [testerPageTypes.ACTION_TESTER_PAGE_START_TESTER_RECORDING](context): Promise<TesterRecordingAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(testerRecordingTypes.ACTION_TESTER_RECORDING_START)
        .then((testerRecordingAdapter: TesterRecordingAdapter) => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_TESTER_RECORDING_START, testerRecordingAdapter);
          resolve(testerRecordingAdapter)
        })
        .catch(reject)
    })
  },
  // 録画終了処理
  [testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING](context): Promise<TesterRecordingAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(testerRecordingTypes.ACTION_TESTER_RECORDING_END)
        .then((testerRecordingAdapter: TesterRecordingAdapter) => {
          resolve(testerRecordingAdapter)
        })
        .catch(reject)
    })
  },
  // 録画終了処理(リカバリー)
  [testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING_RECOVERY](context, request: TesterRecordingRecoveryRequestType): Promise<TesterRecordingRecoveryAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(testerRecordingTypes.ACTION_TESTER_RECORDING_END_RECOVERY, request)
        .then((adapter: TesterRecordingRecoveryAdapter) => {
          resolve(adapter)
        })
        .catch(reject)
    })
  },
  // 録画ステータス取得処理
  [testerPageTypes.ACTION_TESTER_PAGE_GET_TESTER_RECORDING](context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testerRecordingTypes.ACTION_GET_TESTER_RECORDING)
        .then((testerRecordingAdapter: TesterRecordingAdapter) => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_TESTER_RECORDING, testerRecordingAdapter);
          resolve(testerRecordingAdapter);
        })
        .catch((err) => reject(err));
    });
  },
  // 不正疑惑行為サマリ取得処理
  [testerPageTypes.ACTION_TESTER_PAGE_GET_TEST_MARKINGS](context, testId: number): Promise<TestMarkingsAdapter> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testMarkingsTypes.ACTION_TEST_MARKINGS, testId)
        .then((testMarkingsAdapter: TestMarkingsAdapter) => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_TEST_MARKINGS, testMarkingsAdapter);
          resolve(testMarkingsAdapter)
        })
        .catch((err:any) => {
          reject(err)
        })
    })
  },
  // 最新の不正疑惑行為サマリ取得処理
  [testerPageTypes.ACTION_TESTER_PAGE_GET_TEST_MARKINGS_LATEST](context): Promise<TestMarkingsAdapter> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testMarkingsTypes.ACTION_TEST_MARKINGS_LATEST)
        .then((testMarkingsAdapter: TestMarkingsAdapter) => {
          context.commit(testerPageTypes.MUTATION_TESTER_PAGE_SET_TEST_MARKINGS, testMarkingsAdapter);
          resolve(testMarkingsAdapter)
        })
        .catch((err:any) => {
            reject(err)
        })
    });
  },
  /**
   * ログアウトして、ログイン画面に遷移します startupURLにリダイレクトするため、ストア内のデータをすべて初期化します
   *
   * このストアは「受験者」用のストアのため、「監視者」「管理者」のページからこのメソッドを呼び出すことはしないほうがいいです
   *
   * @param {Context} context
   * @return {Promise<any>}
   * @see  front/store/rootStore.ts front/store/types/rootType.ts::ACTION_LOGOUT_AND_REDIRECT_LOGIN_PAGE
   */
  [testerPageTypes.ACTION_TESTER_PAGE_LOGOUT](context) {
    return context.dispatch(rootTypes.ACTION_LOGOUT_AND_REDIRECT_LOGIN_PAGE)
  },
  [testerPageTypes.ACTION_TESTER_PAGE_POST_WEBRTC_MESSAGE](context, payload: WebRTCMessageRequestType) {
    context.dispatch(webrtcMessageTypes.ACTION_WEBRTC_MESSAGE_POST, payload);
  },
// 「AI本人認証」画面
  [testerPageTypes.ACTION_TESTER_PAGE_IDENTITYIMAGE](context, payload: string) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_IDENTITYIMAGE, payload);
  },
  [testerPageTypes.ACTION_TESTER_PAGE_ID_IMAGE](context, payload: string) {
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_ID_IMAGE, payload);
  },
  /**
   * payload: number
   * - 1: AI本人認証O
   * - 2: 本人認証✕監視✕録画◯ ・身分証の認証あり
   * - 3: 本人認証✕監視✕録画◯ ・身分証の認証なし
   */
  [testerPageTypes.ACTION_TESTER_PAGE_FIXED_STR_AI_DISPLAY](context, payload: number) {
    const displayLang: LanguageEnum = context.getters[rootTypes.GETTER_DISPLAY_LANG];
    const fixedStrAiIdentifyList = [
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_1, check: true },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_2, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_3, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_4, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_5, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_6, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_7, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_8, check: false },
      { str: displayLang.AI_IDENTIFICATION_FIXED_STR_9, check: false }
    ];
    if (payload === 1) {
      context.commit(testerPageTypes.MUTATION_TESTER_PAGE_FIXED_STR_AI_DISPLAY, fixedStrAiIdentifyList);
    } else if (payload === 2) {
      context.commit(testerPageTypes.MUTATION_TESTER_PAGE_FIXED_STR_AI_DISPLAY, fixedStrAiIdentifyList.slice(0, 8));
    } else {
      context.commit(testerPageTypes.MUTATION_TESTER_PAGE_FIXED_STR_AI_DISPLAY, fixedStrAiIdentifyList.slice(0, 4));
    }
  },
  [testerPageTypes.ACTION_TESTER_PAGE_FIXED_STR_AI_DISPLAY_CHECK](context, payload: { index: number; bool: boolean }) {
    context.state.fixedStrAiIdentifyList[payload.index].check = payload.bool;
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_FIXED_STR_AI_DISPLAY, context.state.fixedStrAiIdentifyList);
  },
  /**
   *  payload
   * - selectedStr : 注意書きorエラー文字列
   * - noticeType : 1 -> 注意書き, 2 -> エラー
   * - retry? : リトライ回数
   * */
  [testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY](
    context,
    payload: { selectedStr: string; noticeType: number; retry?: number; limite?: number; failStr?: string }
  ) {
    if (payload.limite || payload.retry || payload.failStr) {
      const limite = payload.limite || 0;
      const retry = payload.retry || 0;
      const failStr = payload.failStr || '';
      payload.selectedStr = payload.selectedStr.replace(/n/g, String(limite - retry));
      payload.selectedStr = payload.selectedStr.replace(/N/g, String(limite - 1));
      payload.selectedStr = payload.selectedStr.replace(/C/g, String(limite));
      payload.selectedStr = payload.selectedStr.replace(/S/g, failStr);
    }
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_NOTICE_AI_DISPLAY, payload);
  },
  [testerPageTypes.ACTION_TESTER_PAGE_COUNT_RETRY_NUM](context, payload: number) {
    /*
    const startup = context.getters[rootTypes.GETTER_STARTUP] as StartupAdapter;
    let count: number = 0;
    if (payload === 0) {
      return;
    }

    if (startup.aiAllRetry === 1 && payload === 3) {
      count = 1;
    } else {
      if (payload % startup.aiAllRetry === 0) {
        count = 1;
      }
    }
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_COUNT_RETRY_NUM, count);
    */
    context.commit(testerPageTypes.MUTATION_TESTER_PAGE_COUNT_RETRY_NUM, payload);
  },
  [testerPageTypes.ACTION_TESTER_PAGE_INIT_AI_IDENTIFY](context, testId? : number): Promise<{status: number}>{
    return new Promise((resolve, reject) => {
      // 初期ステータス取得処理後、各々連携作業
      context.dispatch(aiAuthStatusTypes.ACTION_REQUEST_GET_AI_AUTH_STATUS, testId).then((data: AiAuthStatusAdapter) => {
        context.state.identityImage = data.faceUrl;
        context.state.idImage = data.idCardUrl;

        if (data.faceRetry || data.idCardRetry || data.aiAllRetry) {
          context.commit(faceTypes.MUTATION_FACE, data as FaceAdapter);
          context.commit(idCardTypes.MUTATION_ID_CARD, data as IdCardAdapter);
          context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_COUNT_RETRY_NUM, data.aiAllRetry);

          const obj = {
            status: data.status,
            faceUrl: data.faceUrl,
            idCardUrl: data.idCardUrl
          }
          resolve(obj);
        } else {
          const obj = {
            status: 0
          }
          resolve(obj);
        }
      }).catch((err) => {
        // TODO : エラーハンドラー処理。
        console.error(err);
        reject(err);
      })
    });
  },
  [testerPageTypes.ACTION_TESTER_PAGE_TESTER_AUTHENTICATED](context): Promise<boolean>{
    return new Promise((resolve) => {
      context.dispatch(testerTypes.ACTION_TESTER, null).then((testerAdapter: TesterAdapter) => {
        resolve(testerAdapter.authenticatedAt ? true :false);
      })
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
