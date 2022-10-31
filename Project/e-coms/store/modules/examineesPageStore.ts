import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ExamineesPageAdapter } from '@/store/types/adapters/examineesPageAdapter';
import * as types from '@/store/types/examineesPageType';

const state = () => {
  return new ExamineesPageAdapter();
}

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  [types.GETTER_EXAMINEES_PAGE_GET](state: StateType): StateType {
    return { ...state };
  },
}

const mutations: MutationTree<StateType> = {
}

const actions: ActionTree<StateType, StateType> = {
}

export default {
  state,
  getters,
  mutations,
  actions,
};
