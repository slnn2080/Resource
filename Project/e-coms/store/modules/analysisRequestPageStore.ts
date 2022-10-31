import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  AnalysisRequestPageAdapter,
  AnalysisRequestInitialParam,
  AnalysisRequestFormValues,
  AnalysisRequestTableValues,
} from '@/store/types/adapters/analysisRequestPageAdapter';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as types from '@/store/types/analysisRequestPageType';
import * as testersTypes from '@/store/types/testersType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as testersConditionsTypes from '@/store/types/testersConditionsType';
import {
  Tester,
  SelectableTester,
  TestersRequestType,
} from '@/store/types/adapters/testersAdapter';

import {
  TestersConditions
} from '@/store/types/adapters/testersConditionsAdapter';

import * as initialParamApiType from '@/store/types/analysisRequestInitailParamApiType';
import {
  AnalysisRequestInitialParamApiAdapter,
  AnalysisRequestInitialParamApiRequestType,
} from '@/store/types/adapters/analysisRequestInitialParamApiAdapter.ts';
import * as indexApiType from '@/store/types/analysisRequestIndexApiType';
import {
  AnalysisRequestIndexApiAdapter,
  AnalysisRequest,
  AnalysisRequestIndexApiRequestType,
  AnalysisRequestIndexApiSettingAndRequestType,
} from '@/store/types/adapters/analysisRequestIndexApiAdapter.ts';
import * as requestApiType from '@/store/types/analysisRequestRequestApiType';
import {
  AnalysisRequestRequestApiAdapter,
  AnalysisRequestRequestApiRequestType,
} from '@/store/types/adapters/analysisRequestRequestApiAdapter.ts';

const state = () => {
  return new AnalysisRequestPageAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  // AI解析依頼初期パラメータ
  [types.GETTER_ANALYSIS_REQUEST_PAGE_GET_INITIAL_PARAM](state: StateType): AnalysisRequestInitialParam {
    return state.initialParam;
  },
  // AI解析依頼フォーム
  [types.GETTER_ANALYSIS_REQUEST_PAGE_GET_FORM_VALUES](state: StateType):  AnalysisRequestFormValues {
    return state.formValues;
  },
  // AI解析依頼テーブル
  [types.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES](state: StateType): AnalysisRequestTableValues {
    return state.tableValues;
  },
}

const mutations: MutationTree<StateType> = {
  // AI解析依頼初期パラメータ
  [types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_INITIAL_PARAM](state: StateType, initialParam: AnalysisRequestInitialParam) {
    state.initialParam = initialParam;
  },
  // AI解析依頼フォーム
  [types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_FORM_VALUES](state: StateType, payload: AnalysisRequestFormValues) {
    state.formValues = payload;
  },
  [types.MUTATION_ANALYSIS_REQUEST_PAGE_CLEAR_FORM_VALUES](state: StateType) {
    state.formValues.clear();
  },
  // AI解析依頼テーブル
  [types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_TABLE_VALUES](state: StateType, payload: AnalysisRequestTableValues) {
    state.tableValues = payload;
  }
}

const actions: ActionTree<StateType, StateType> = {
  // AI解析依頼初期パラメータ
  [types.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_INITIAL_PARAM](context): Promise<AnalysisRequestInitialParamApiAdapter> {
    return new Promise((resolve, reject) => {
      const request: AnalysisRequestInitialParamApiRequestType = {
      };

      context
        .dispatch(initialParamApiType.ACTION_ANALYSIS_REQUEST_INITIAL_PARAM_API, request)
        .then((adapter: AnalysisRequestInitialParamApiAdapter) => {
          const initialParam: AnalysisRequestInitialParam = adapter;
          context.commit(types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_INITIAL_PARAM, initialParam);
          resolve(adapter);
        })
        .catch(() => {
          reject();
        });
    });
  },
  // AI解析依頼フォーム
  [types.ACTION_ANALYSIS_REQUEST_PAGE_SET_FORM_VALUES](context, payload: AnalysisRequestFormValues) {
     context.commit(types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_FORM_VALUES, payload);
  },
  [types.ACTION_ANALYSIS_REQUEST_PAGE_CLEAR_FORM_VALUES](context) {
     context.commit(types.MUTATION_ANALYSIS_REQUEST_PAGE_CLEAR_FORM_VALUES);
  },
  [types.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_REQUEST](context): Promise<AnalysisRequestRequestApiAdapter> {
    return new Promise((resolve, reject) => {
      const formValues = context.getters[types.GETTER_ANALYSIS_REQUEST_PAGE_GET_FORM_VALUES];
      const selectedTesters:SelectableTester[] = context.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SELECTED_TESTERS];
      const selectedTesterIds = selectedTesters
        .map(v => v.tester.testId as number);

      const request: AnalysisRequestRequestApiRequestType = {
        analysis_inseq: formValues.analysisInseq,
        analysis_status: formValues.analysisStatus,
        testers: selectedTesterIds,
      };

      context
        .dispatch(requestApiType.ACTION_ANALYSIS_REQUEST_REQUEST_API, request)
        .then((adapter: AnalysisRequestRequestApiAdapter) => {
          resolve(adapter);
        })
        .catch((adapter: AnalysisRequestRequestApiAdapter) => {
          reject(adapter);
        });
    });
  },
  // AI解析依頼テーブル
  [types.ACTION_ANALYSIS_REQUEST_PAGE_SET_TABLE_VALUES](context, payload: AnalysisRequestTableValues): void {
     context.commit(types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_TABLE_VALUES, payload);
  },
  [types.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_INDEX](context): Promise<AnalysisRequestIndexApiAdapter> {
    return new Promise((resolve, reject) => {
      const initialParam = context.getters[types.GETTER_ANALYSIS_REQUEST_PAGE_GET_INITIAL_PARAM];
      if (!initialParam.domain || !initialParam.env) {
        console.log('初期化パラメータを取得できていないため、解析情報取得処理ポーリング処理は遅延します。');
        reject();
        return;
      }

      const tableValues = context.getters[types.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES];
      const request:AnalysisRequestIndexApiRequestType = {
        sort_key: tableValues.sortKey,
        sort_order: tableValues.sortOrder,
      };
      const settingAndRequest: AnalysisRequestIndexApiSettingAndRequestType = {
        setting: {
          domain: initialParam.domain,
        },
        request,
      };

      context
        .dispatch(indexApiType.ACTION_ANALYSIS_REQUEST_INDEX_API, settingAndRequest)
        .then((adapter: AnalysisRequestIndexApiAdapter) => {
          const tableValues = context.getters[types.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES];
          tableValues.analysisRequests = adapter.analysisRequests;

          context.commit(types.MUTATION_ANALYSIS_REQUEST_PAGE_SET_TABLE_VALUES, tableValues);
          resolve(adapter);
        })
        .catch(() => {
          reject();
        });
    });
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
