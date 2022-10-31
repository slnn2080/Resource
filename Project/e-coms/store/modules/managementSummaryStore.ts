import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  ManagementSummaryAdapter,
  ManagementSummaryRequestType,
  ManagementSummaryResponseType
} from '@/store/types/adapters/managementSummaryAdapter';
import * as managementSummaryTypes from '@/store/types/managementSummaryType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new ManagementSummaryAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [managementSummaryTypes.ACTION_MANAGEMENT_SUMMARY](context, request: ManagementSummaryRequestType): Promise<ManagementSummaryAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.MANAGEMENT_SUMMARY.url, {
          params: request
        })
        .then((response: ManagementSummaryResponseType) => {
          if (response.status === 200) {
            const adapter = ManagementSummaryAdapter.fromResponse(response.result)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MANAGEMENT_SUMMARY,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[ManagementSummary error] : ', e);
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
