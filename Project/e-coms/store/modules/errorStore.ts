import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ErrorAdapter, ErrorStatus } from '@/store/types/adapters/errorAdapter';
import * as types from '@/store/types/errorType';
import { EndpointType } from '@/store/const/endpoint';

const state = () => {
  return new ErrorAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  [types.GETTER_ERRORS](state: StateType) {
    return { ...state };
  }
};

const mutations: MutationTree<StateType> = {
  [types.MUTATION_SET_ERROR](state: StateType, payload: ErrorStatus) {
    const endpoint: EndpointType = payload.endpoint;
    state.hash[endpoint.apiType] = payload;
  },
};

const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_SET_ERROR](context, payload: ErrorStatus) {
    context.commit(types.MUTATION_SET_ERROR, payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
