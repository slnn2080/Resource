import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  DeletePlanPageAdapter,
  DeletePlanFormValues,
} from '@/store/types/adapters/deletePlanPageAdapter';
import * as deletePlanPageTypes from '@/store/types/deletePlanPageType';
import {
  DeletePlanAdapter,
  DeletePlanRequestType,
  DeletePlanResponseType,
  DeletePlanKey,
} from '@/store/types/adapters/deletePlanAdapter';
import * as deletePlanTypes from '@/store/types/deletePlanType';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes  from '@/store/types/rootType';
import * as managementPageTypes from '@/store/types/managementPageType';

const state = () => {
  return new DeletePlanPageAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   * フォームの値を取得する
   */
  [deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES](state: StateType): DeletePlanFormValues {
    return state.formValues;
  },
  /**
   * フォームの値を取得する deletePlanKey
   */
  [deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DELETE_PLAN_KEY](state: StateType): DeletePlanKey {
    return state.formValues.deletePlanKey
  },
  /**
   * フォームの値を取得する date
   */
  [deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DATE](state: StateType): string {
    return state.formValues.date;
  },
}

const mutations: MutationTree<StateType> = {
  /**
   * フォームの値をクリアする
   */
  [deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_CLEAR_FORM_VALUES](state: StateType) {
    state.formValues.clear();
  },
  /**
   * フォームの値を設定する
   */
  [deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES](state: StateType, payload: DeletePlanFormValues) {
    state.formValues = payload;
  },
  /**
   * フォームの値を設定する deletePlanKey
   */
  [deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DELETE_PLAN_KEY](state: StateType, payload: DeletePlanKey) {
    state.formValues.deletePlanKey = payload;
  },
  /**
   * フォームの値を設定する date
   */
  [deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DATE](state: StateType, payload: string) {
    state.formValues.date = payload;
  },
}

const actions: ActionTree<StateType, StateType> = {
  /**
   * フォームの値をクリアする
   */
  [deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_CLEAR_FORM_VALUES](context): void {
    context.commit(deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_CLEAR_FORM_VALUES);
  },
  /**
   * フォームの値を設定する
   */
  [deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES](context, payload: DeletePlanFormValues): void {
    context.commit(deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES, payload);
  },
  /**
   * フォームの値を設定する deletePlanKiind
   */
  [deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DELETE_PLAN_KEY](context, payload: DeletePlanKey): void {
    context.commit(deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DELETE_PLAN_KEY, payload);
  },
  /**
   * フォームの値を設定する date
   */
  [deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DATE](context, payload: string): void {
    context.commit(deletePlanPageTypes.MUTATION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DATE, payload);
  },
  /**
   * API呼び出し
   */
  [deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_DOWNLOAD](context): Promise<boolean>{
    return new Promise((resolve, reject) => {
      const request = {
        key: context.getters[deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DELETE_PLAN_KEY],
        execution_time: context.getters[deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DATE] + ' 00:00:00',
      } as DeletePlanRequestType 

      context
        .dispatch(deletePlanTypes.ACTION_DELETE_PLAN_DOWNLOAD, request)
        .then((result: boolean) => {
          resolve(result)
        })
        .catch((e) => {
          reject(e)
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
