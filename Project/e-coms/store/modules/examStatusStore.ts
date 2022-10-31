import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  ExamStatusAdapter,
  ExamStatusRequestType,
  ExamStatusResponseType
} from '@/store/types/adapters/examStatusAdapter';
import * as types from '@/store/types/examStatusType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new ExamStatusAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_CHANGE_EXAM_STATUS](context, payload: ExamStatusRequestType): Promise<ExamStatusAdapter> {
    console.log('[LOG INFO] get tester recording start');
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.EXAM_STATUS.url, payload)
        .then((response: ExamStatusResponseType) => {
          if (response.status === 200) {
            const adapter = ExamStatusAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            // TODO : 試験の開始、中断、終了、再開に応じて処理を分岐（必要なら）
            const err: ErrorStatus = {
              endpoint: Endpoint.EXAM_STATUS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          console.error('[Tester Recording error start] : ', e);
          reject(e)
        });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
