/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  Tester,
  TestersAdapter,
  TestersRequestType,
  TestersResponseType,
} from '@/store/types/adapters/testersAdapter';
import * as types from '@/store/types/testersType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';
import { Formatter } from '@/utils/Formatter';

const state = () => {
  return new TestersAdapter();
}

type TestersState = ReturnType<typeof state>;

const getters: GetterTree<TestersState, TestersState> = {
};

const mutations: MutationTree<TestersState> = {
};

const actions: ActionTree<TestersState, TestersState> = {
  [types.ACTION_TESTERS](context, request: TestersRequestType): Promise<{ count: number, pageCount: number, page: number, testers: Tester[] }> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TESTERS.url, {
          params: request,
        })
        .then((response: TestersResponseType) => {
          if (response.status === 200) {
            const testers = response.result.testers.map(tester => ({
              testId        : tester.test_id,
              group         : tester.group,
              testName      : tester.test_name,
              region        : tester.region,
              testAt        : tester.test_at,
              stopAt        : tester.stop_at,
              examName      : tester.exam_name,
              withMark      : tester.with_mark,
              record        : tester.record,
              userId        : tester.user_id,
              loginId       : tester.login_id,
              cheatingLevel : tester.cheating_level,
              totalScore    : tester.total_score,
            }));
            resolve({
              count: response.result.count,
              pageCount: response.result.page_count,
              page: response.result.page,
              testers,
            });
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTERS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Testers error] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  [types.ACTION_DOWNLOAD_TESTERS](context, request: TestersRequestType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(Endpoint.DOWNLOAD_EXAM_USER_LIST.url, {
          params: request,
          responseType: 'blob',
        })
        .then(async (rawResponse: any) => {
          console.log('[LOG INFO] download response:', rawResponse)
          if (rawResponse.status == 200) {
            const fileName = 'exam_user_resultinfo_csv_' + Formatter.date('yyyyMMddhhmmss', new Date()) + '.csv';

            const url = URL.createObjectURL(new Blob([rawResponse.data], {type: 'text/csv'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            (link as any).parentNode.removeChild(link);

            resolve(true)
          } else {
            let response;
            try {
              response = JSON.parse(await rawResponse.data.text())
            } catch (e) {
              response = {
                status: 500,
                message: 'response.dataのパースに失敗しました。',
              }
            }

            const err: ErrorStatus = {
              endpoint: Endpoint.DOWNLOAD_EXAM_USER_LIST,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch(async (e: any) => {
          const rawResponse = e.response
          let response;
          try {
            response = JSON.parse(await rawResponse.data.text())
          } catch (e) {
            response = {
              status: 500,
              message: 'response.dataのパースに失敗しました。',
            }
          }

          console.error('[Download Testers error] : ', e);
          // TODO : will be implement error log api request.
          reject(new Error(response.message));
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
