import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as examineeLoginPageTypes from '@/store/types/examineeLoginPageType';
import * as testerDetailTypes from '@/store/types/testerDetailType';
import { ExamineeLoginPageAdapter } from '@/store/types/adapters/examineeLoginPageAdapter';
import {
  TesterDetailAdapter,
  TesterDetailRequestType,
} from '@/store/types/adapters/testerDetailAdapter';

const state = () => {
  return new ExamineeLoginPageAdapter();
};

type examineeLoginPage = ReturnType<typeof state>;

const getters: GetterTree<examineeLoginPage, examineeLoginPage> = {
  [examineeLoginPageTypes.GETTER_EXAMINEE_LOGIN_PAGE](state: ExamineeLoginPageAdapter) {
    return { ...state };
  }
};

const mutations: MutationTree<examineeLoginPage> = {
  [examineeLoginPageTypes.MUTATION_EXAMINEE_LOGIN_PAGE_TEST](state: examineeLoginPage, payload: TesterDetailAdapter) {
    state.testerDetail = payload;
  },
};

const actions: ActionTree<examineeLoginPage, examineeLoginPage> = {
  [examineeLoginPageTypes.ACTION_EXAMINEE_LOGIN_PAGE_GET_TEST](context, payload: TesterDetailRequestType): Promise<void> {
    return new Promise((resolve, reject) => {
      context.dispatch(testerDetailTypes.ACTION_GET_TESTER_DETAIL, payload)
        .then((adapter: TesterDetailAdapter) => {
          context.commit(examineeLoginPageTypes.MUTATION_EXAMINEE_LOGIN_PAGE_TEST, adapter);
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
