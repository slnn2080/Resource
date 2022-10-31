import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  FixedNotificationsAdapter,
  FixedNotificationsResponseType
} from '@/store/types/adapters/fixedNotificationsAdapter';
import * as errTypes from '@/store/types/errorType';
import * as types from '@/store/types/fixedNotificationsType';
import { Endpoint } from '@/store/const/endpoint';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
const state = () => {
  return new FixedNotificationsAdapter();
};

type fixedNotificationList = ReturnType<typeof state>;

const getters: GetterTree<fixedNotificationList, fixedNotificationList> = {
  [types.GETTER_FIXEDNOTIFICATIONS_LIST](state: fixedNotificationList) {
    return { ...state };
  }
};

const mutations: MutationTree<fixedNotificationList> = {
  [types.MUTATION_FIXEDNOTIFICATIONS_LIST](state: fixedNotificationList, payload: FixedNotificationsAdapter) {
    state.fixedNotificationList = payload.fixedNotificationList;
  }
};

const actions: ActionTree<fixedNotificationList, fixedNotificationList> = {
  [types.ACTION_FIXEDNOTIFICATIONS_GET_REQEUST](context) {
    console.log('[LOG INFO] ACTION_MARKS_GET_REQEUST');
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.FIXED_NOTIFICATIONS.url)
        .then((response: FixedNotificationsResponseType) => {
          if (response.status === 200) {
            const obj = new FixedNotificationsAdapter();
            response.result.forEach((val) => {
              obj.fixedNotificationList.push({
                id: val.id,
                message: val.message,
                orderId: val.order_id
              });
            });
            context.commit(types.MUTATION_FIXEDNOTIFICATIONS_LIST, obj);
            resolve(context.getters[types.GETTER_FIXEDNOTIFICATIONS_LIST]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.FIXED_NOTIFICATIONS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            resolve(err);
          }
        })
        .catch((e: any) => {
          console.error('[ACTION_FIXEDNOTIFICATIONS_GET_REQEUST] error : ', e);
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
