import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  DeviceLoggingAdapter,
  DeviceLoggingRequestType,
  DeviceLoggingResponseType
} from '@/store/types/adapters/deviceLoggingAdapter';
import * as deviceLoggingTypes from '@/store/types/deviceLoggingType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new DeviceLoggingAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [deviceLoggingTypes.ACTION_DEVICE_LOGGING](context, request: DeviceLoggingRequestType): Promise<DeviceLoggingAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.DEVICE_LOGGING.url, request)
        .then((response: DeviceLoggingResponseType) => {
          if (response.status === 200) {
            const adapter = DeviceLoggingAdapter.fromResponse(response)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.DEVICE_LOGGING,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[DeviceLogging error] : ', e);
          // エラー時の処理
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
