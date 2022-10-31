import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  Message,
  WebRTCMessagePostAdapter,
  WebRTCMessagePostRequestType,
  WebRTCMessagePostResponseType,
  WebRTCMessageGetAdapter,
  WebRTCMessageGetRequestType,
  WebRTCMessageGetResponseType,
} from '@/store/types/adapters/webrtcMessageAdapter';
import * as webrtcMessageTyps from '@/store/types/webrtcMessageType';
import { Endpoint } from '@/store/const/endpoint';
import * as errorTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return {} // notiong
}

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
}

const mutations: MutationTree<StateType> = {
}

const actions: ActionTree<StateType, StateType> = {
  /**
   * 書き込みます
   *
   * @param {Context} context
   * @param {WebRTCMessagePostRequestType} request
   * @return {Promise<WebRTCMessagePostAdapter>}
   */
  [webrtcMessageTyps.ACTION_WEBRTC_MESSAGE_POST](context, request: WebRTCMessagePostRequestType): Promise<WebRTCMessagePostAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.WEBRTC_MESSAGE.url, request)
        .then((response: WebRTCMessagePostResponseType) => {
          if (response.status === 200) {
            const adapter = WebRTCMessagePostAdapter.fromResponse(response)
            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.WEBRTC_MESSAGE,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((err: any) => {
          console.error('[WebRTC Message Error] : ', err);
          reject(err);
        });
    });
  },
  /**
   * 一覧を取得します
   *
   * @param {Context} context
   * @param {WebRTCMessageGetRequestType} requests
   * @return {Promise<WebRTCMessageGetAdapter>}
   */
  [webrtcMessageTyps.ACTION_WEBRTC_MESSAGE_GET](context, request: WebRTCMessageGetRequestType): Promise<WebRTCMessageGetAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.WEBRTC_MESSAGE.url, request)
        .then((response: WebRTCMessageGetResponseType) => {
          if (response.status === 200) {
            const adapter = WebRTCMessageGetAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.WEBRTC_MESSAGE,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((err: any) => {
          console.error('[WebRTC Message Error] : ', err);
          reject(err);
        });
    });
  },
}

export default {
  state,
  getters,
  mutations,
  actions
};
