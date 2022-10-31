/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Endpoint } from '@/store/const/endpoint';
import {
  TesterRecordingAdapter,
  TesterRecordingResponseType,
  TesterRecordingRecoveryAdapter,
  TesterRecordingRecoveryRequestType,
  TesterRecordingRecoveryResponseType,
} from '@/store/types/adapters/testerRecordingAdapter';
import * as types from '@/store/types/testerRecordingType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TesterRecordingAdapter();
};

type TesterRecordingState = ReturnType<typeof state>;

const getters: GetterTree<TesterRecordingState, TesterRecordingState> = {
  [types.GETTER_TESTER_RECORDING](state: TesterRecordingState) {
    return { ...state };
  }
};

const mutations: MutationTree<TesterRecordingState> = {
  [types.MUTATION_TESTER_RECORDING](state: TesterRecordingState, payload: TesterRecordingAdapter) {
    state.accessKeyId = payload.accessKeyId;
    state.secretAccessKey = payload.secretAccessKey;
    state.sessionToken = payload.sessionToken;
    state.bucket = payload.bucket;
    state.key = payload.key;
    state.uploadId = payload.uploadId;
    state.interval = payload.interval;
  },
  [types.MUTATION_TESTER_RECORDING_CLEAR](state: TesterRecordingState) {
    state.accessKeyId = null;
    state.secretAccessKey = null;
    state.sessionToken = null;
    state.bucket = null;
    state.key = null;
    state.uploadId = null;
    state.interval = 0;
  }
};

const actions: ActionTree<TesterRecordingState, TesterRecordingState> = {
  [types.ACTION_GET_TESTER_RECORDING](context) {
    console.log('[LOG INFO] get tester recording');
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TESTER_RECORDING.url, {})
        .then((response: TesterRecordingResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_RECORDING, {
              accessKeyId: response.result.access_key_id,
              secretAccessKey: response.result.secret_access_key,
              sessionToken: response.result.session_token,
              bucket: response.result.bucket,
              key: response.result.key,
              uploadId: response.result.upload_id,
              interval: response.result.interval
            });
            resolve(context.getters[types.GETTER_TESTER_RECORDING]);
          } else {
            // TODO : ステータスごとに処理を分ける
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_RECORDING,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Tester Recording error start] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  // 録画開始
  [types.ACTION_TESTER_RECORDING_START](context): Promise<TesterRecordingAdapter> {
    console.log('[LOG INFO] get tester recording start');
    context.commit(types.MUTATION_TESTER_RECORDING, new TesterRecordingAdapter());
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_RECORDING.url, {
          method: 'PUT' // PUT固定
        })
        .then((response: TesterRecordingResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_RECORDING, {
              accessKeyId: response.result.access_key_id,
              secretAccessKey: response.result.secret_access_key,
              sessionToken: response.result.session_token,
              bucket: response.result.bucket,
              key: response.result.key,
              uploadId: response.result.upload_id,
              interval: response.result.interval
            });
            resolve(context.getters[types.GETTER_TESTER_RECORDING]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_RECORDING,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          // TODO: エラーコードによるエラーハンドリング
          // TODO: 401 認証エラー
          // TODO: 400 録画開始不能
          // TODO: 404 試験なし
          console.error('[Tester Recording error start] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  // 録画終了処理
  [types.ACTION_TESTER_RECORDING_END](context): Promise<TesterRecordingAdapter> {
    console.log('[LOG INFO] tester recording end');
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_RECORDING.url, {
          method: 'DELETE' // DELETE固定
        })
        .then((response: TesterRecordingResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_RECORDING_CLEAR);
            resolve(context.getters[types.GETTER_TESTER_RECORDING]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_RECORDING,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          // TODO: エラーコードによるエラーハンドリング
          // TODO: 401: 認証エラー
          // TODO: 404: 試験なし
          console.error('[Tester Recording error start] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  // 録画終了処理(リカバリー)
  [types.ACTION_TESTER_RECORDING_END_RECOVERY](context, request: TesterRecordingRecoveryRequestType): Promise<TesterRecordingRecoveryAdapter> {
    console.log('[LOG INFO] tester recording end recovery', request);
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_RECORD_RECOVERY.url, request)
        .then((response: TesterRecordingRecoveryResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_RECORDING_CLEAR);
            const adapter = TesterRecordingRecoveryAdapter.fromResponse(response)
            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_RECORD_RECOVERY,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          console.error('[Tester Recording End Recovery error start] : ', e);
          reject(e);
        });
    })
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
