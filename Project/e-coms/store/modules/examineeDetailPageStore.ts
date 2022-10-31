/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TestPassAdapter,
  SwitchTestPassResponseType,
  SwitchTestPassRequestType,
  GetTestPassRequestType,
  GetTestPassResponseType
} from '@/store/types/adapters/testPassAdapter';
import { ExamineeDetailPageAdapter } from '../types/adapters/examineeDetailPageAdapter';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import * as rootTypes from '@/store/types/rootType';
import * as passTypes from '@/store/types/testPassType';
import {
  TesterDetailAdapter,
  TesterDetailRequestType,
} from '@/store/types/adapters/testerDetailAdapter';
import * as testerDetailTypes from '@/store/types/testerDetailType';


const state = () => {
  return new ExamineeDetailPageAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  [examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE](state: StateType) {
    return { ...state };
  },
  [examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL](state: StateType): TesterDetailAdapter {
    return {...state.testerDetail};
  },
};

const mutations: MutationTree<StateType> = {
  [examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_SET_TESTER_DETAIL](state: StateType, payload: TesterDetailAdapter) {
    state.testerDetail = payload;
  },
  [examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_SWITCH_TEST_PASS](state, payload: SwitchTestPassRequestType){
    if (payload.method === 'PUT') {
      state.status = 1;
    } else if (payload.method === 'DELETE'){
      state.status = 0;
    }
  },
  [examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_GET_TEST_PASS](state, payload: GetTestPassResponseType){
    state.status = payload.status;
  },
}

const actions: ActionTree<StateType, StateType> = {
  [examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL](context, payload: TesterDetailRequestType): Promise<TesterDetailAdapter> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testerDetailTypes.ACTION_GET_TESTER_DETAIL, payload)
          .then((result: TesterDetailAdapter) => {
            context.commit(examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_SET_TESTER_DETAIL, result);
            resolve(result);
          })
          .catch((e:any) => {
            reject(e);
          });
    });
  },
  // 試験結果更新処理
  [examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_SWITCH_TEST_PASS](context, payload:{ testId: number, method: string }):Promise<any> {
    return new Promise((resolve, reject) => {
      context.dispatch(passTypes.ACTION_SWITCH_TEST_PASS, { test_id: payload.testId, method: payload.method })
      .then(() => {
        context.commit(examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_SWITCH_TEST_PASS, payload);
        resolve(true);
      })
      .catch((e: any) => {
        reject(e);
      });
    });
  },
  [examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TEST_PASS](context, payload: GetTestPassRequestType) {
    return context.dispatch(passTypes.ACTION_GET_TEST_PASS, payload.testId)
      .then((testPassAdapter: TestPassAdapter) => {
        context.commit(examineeDetailPageTypes.MUTATION_EXAMINEE_DETAIL_PAGE_GET_TEST_PASS, testPassAdapter);
      });
  },
}

export default {
  state,
  getters,
  mutations,
  actions
};
