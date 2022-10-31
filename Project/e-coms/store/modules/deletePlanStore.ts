/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  DeletePlanAdapter,
  DeletePlanRequestType,
  DeletePlanResponseType,
  DeletePlanKey,
} from '@/store/types/adapters/deletePlanAdapter';
import * as deletePlanTypes from '@/store/types/deletePlanType';
import * as managementPageTypes from '@/store/types/managementPageType';
import * as errorTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';
import { Formatter } from '@/utils/Formatter';

const state = () => {
  return {}
}

type TestersState = ReturnType<typeof state>;

const getters: GetterTree<TestersState, TestersState> = {
};

const mutations: MutationTree<TestersState> = {
};

const actions: ActionTree<TestersState, TestersState> = {
  [deletePlanTypes.ACTION_DELETE_PLAN_DOWNLOAD](context, request: DeletePlanRequestType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(Endpoint.DELETE_PLAN_DOWNLOAD.url, {
          params: request,
          responseType: 'blob',
        })
        .then(async (rawResponse: any) => {
          console.log('[LOG INFO] download response:', rawResponse)
          if (rawResponse.status == 200) {
            const map = {} as {[key: /*DeletePlanKey*/string]: string}
            map[DeletePlanKey.TESTER as string] = DeletePlanKey.TESTER;
            map[DeletePlanKey.RECORD as string] = DeletePlanKey.RECORD;

            const formattedDate = Formatter.date('yyyyMMdd', new Date(request.execution_time))
            const fileName = 'delete_plan_csv_' + map[request.key] + '_' + formattedDate + '.csv';

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
              endpoint: Endpoint.DELETE_PLAN_DOWNLOAD,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch(async (e: any) => {
          const rawResponse = e.response
          let response;
          try {
            const text = await rawResponse.data.text()
            response = JSON.parse(text)
          } catch (e) {
            response = {
              status: 500,
              message: 'response.dataのパースに失敗しました。',
            }
          }

          console.error('[Download Delete Plan error] : ', e);
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
