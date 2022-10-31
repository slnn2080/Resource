/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ProctorAdminPermissionIpAdapter, ProctorAdminPermissionIpResponseType, ProctorAdminPermissionIpRequestType } from '@/store/types/adapters/proctorAdminPermissionIpAdapter';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import * as proctorAdminPermissionIpType from '@/store/types/proctorAdminPermissionIpType';
import * as errorType from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';


const state = () => {
  return new ProctorAdminPermissionIpAdapter();
};

type ProctorAdminPermissionIpState = ReturnType<typeof state>;

const getters: GetterTree<ProctorAdminPermissionIpState, ProctorAdminPermissionIpState> = {
  [proctorAdminPermissionIpType.GETTER_PROCTOR_ADMIN_PERMISSION_IP_PAGE_GET_IS_VALID_IP](state: ProctorAdminPermissionIpState) {
    return { ...state }.status;
  }
};

const mutations: MutationTree<ProctorAdminPermissionIpState> = {
  [proctorAdminPermissionIpType.MUTATION_PROCTOR_ADMIN_PERMISSION_IP_PAGE_SET_VALUES](state: ProctorAdminPermissionIpState, payload: ProctorAdminPermissionIpAdapter) {
    state.status = payload.status;
  }
};

const actions: ActionTree<ProctorAdminPermissionIpState, ProctorAdminPermissionIpState> = {
  [proctorAdminPermissionIpType.ACTION_PROCTOR_ADMIN_PERMISSION_IP_PAGE_CALL_API_SELECT](
    context,
  ): Promise<ProctorAdminPermissionIpResponseType | ErrorStatus> {
    return new Promise((resolve, reject) => {
      const request: ProctorAdminPermissionIpRequestType = {
      };
      this.$axios
      .$get(Endpoint.PROCTOR_ADMIN_PERMISSION_IP.url, request)
        .then((response: ProctorAdminPermissionIpResponseType) => {
          if (response.status === 200) {
            context.commit(proctorAdminPermissionIpType.MUTATION_PROCTOR_ADMIN_PERMISSION_IP_PAGE_SET_VALUES, response);
            resolve(context.getters[proctorAdminPermissionIpType.GETTER_PROCTOR_ADMIN_PERMISSION_IP_PAGE_GET_IS_VALID_IP]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.PROCTOR_ADMIN_PERMISSION_IP,
              status: response.status,
              message: response.message,
              result: response.result
            };
            context.dispatch(errorType.ACTION_SET_ERROR, err);
            resolve(err);
          }
        })
        .catch((e: any) => {
          console.error('[proctorAdminPermissionIp http request error] : ', e);
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
