import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { MarksAdapter, MarksResponseType } from '@/store/types/adapters/marksAdapter';
import * as errTypes from '@/store/types/errorType';
import * as types from '~/store/types/marksType';
import { Endpoint } from '@/store/const/endpoint';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
const state = () => {
  return new MarksAdapter();
};

type markList = ReturnType<typeof state>;

const getters: GetterTree<markList, markList> = {
  [types.GETTER_MARK_LIST](state: markList) {
    return { ...state };
  }
};

const mutations: MutationTree<markList> = {
  [types.MUTATION_MARK_LIST](state: markList, payload: MarksAdapter) {
    state.markList = payload.markList;
  }
};

const actions: ActionTree<markList, markList> = {
  [types.ACTION_MARKS_GET_REQEUST](context) {
    console.log('[LOG INFO] ACTION_MARKS_GET_REQEUST');
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.MARKS.url)
        .then((response: MarksResponseType) => {
          if (response.status === 200) {
            const obj = new MarksAdapter();
            response.result.forEach((val) => {
              obj.markList.push({
                id: val.id,
                message: val.message,
                orderId: val.order_id,
                label: val.label,
                display: val.display
              });
            });
            context.commit(types.MUTATION_MARK_LIST, obj);
            resolve(context.getters[types.GETTER_MARK_LIST]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MARKS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            resolve(err);
          }
        })
        .catch((e: any) => {
          console.error('[ACTION_MARKS_GET_REQEUST] error : ', e);
          reject(e);
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
