import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { CommonExamineesAdapter, CommonExamineesFormValues } from '@/store/types/adapters/commonExamineesAdapter';
import { Tester, SelectableTester, TestersRequestType } from '@/store/types/adapters/testersAdapter';
import * as types from '@/store/types/commonExamineesType';
import * as testersTypes from '@/store/types/testersType';
import * as testersConditionsTypes from '@/store/types/testersConditionsType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

const state = () => {
  return new CommonExamineesAdapter();
}

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  // 検索条件の選択肢
  [types.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS](state: StateType): TestersConditions {
    return state.conditions;
  },
  // テスター検索フォーム
  [types.GETTER_COMMON_EXAMINEES_GET_FORM_VALUES](state: StateType): CommonExamineesFormValues {
    return state.formValues
  },
  [types.GETTER_COMMON_EXAMINEES_GET_FORM_VALUES_FOR_DOWNLOAD](state: StateType): CommonExamineesFormValues | null {
    return state.formValuesForDownload
  },
  [types.GETTER_COMMON_EXAMINEES_GET_GROUP](state: StateType): string | null {
    return state.formValues.group
  },
  [types.GETTER_COMMON_EXAMINEES_GET_GROUP_CODE](state: StateType): string | null {
    return state.formValues.groupCode
  },
  [types.GETTER_COMMON_EXAMINEES_GET_TEST_NAME](state: StateType): string | null {
    return state.formValues.testName
  },
  [types.GETTER_COMMON_EXAMINEES_GET_REGION](state: StateType): string | null {
    return state.formValues.region
  },
  [types.GETTER_COMMON_EXAMINEES_GET_TEST_AT_DATE_FROM](state: StateType): string | null {
    return state.formValues.testAtDateFrom
  },
  [types.GETTER_COMMON_EXAMINEES_GET_TEST_AT_DATE_TO](state: StateType): string | null {
    return state.formValues.testAtDateTo
  },
  [types.GETTER_COMMON_EXAMINEES_GET_TEST_AT_TIME_FROM](state: StateType): string | null {
    return state.formValues.testAtTimeFrom
  },
  [types.GETTER_COMMON_EXAMINEES_GET_TEST_AT_TIME_TO](state: StateType): string | null {
    return state.formValues.testAtTimeTo
  },
  [types.GETTER_COMMON_EXAMINEES_GET_LOGIN_ID](state: StateType): string | null {
    return state.formValues.loginId
  },
  [types.GETTER_COMMON_EXAMINEES_GET_EXAM_NAME](state: StateType): string | null {
    return state.formValues.examName
  },
  [types.GETTER_COMMON_EXAMINEES_GET_IS_LIKE_SEARCH](state: StateType): number | null {
    return state.formValues.isLikeSearch
  },
  [types.GETTER_COMMON_EXAMINEES_GET_RECORD](state: StateType): number | null {
    return state.formValues.record
  },
  [types.GETTER_COMMON_EXAMINEES_GET_WITH_MARK](state: StateType): number | null {
    return state.formValues.withMark
  },
  [types.GETTER_COMMON_EXAMINEES_GET_CHEATING_LEVEL_FROM](state: StateType): number | null {
    return state.formValues.cheatingLevelFrom
  },
  [types.GETTER_COMMON_EXAMINEES_GET_CHEATING_LEVEL_TO](state: StateType): number | null {
    return state.formValues.cheatingLevelTo
  },
  [types.GETTER_COMMON_EXAMINEES_GET_SCORE](state: StateType): number | null {
    return state.formValues.score
  },
  [types.GETTER_COMMON_EXAMINEES_GET_AI_ANALYSIS_FLAG](state: StateType): number | null {
    return state.formValues.aiAnalysisFlag
  },
  [types.GETTER_COMMON_EXAMINEES_GET_AI_ANALYSIS_BATCH_FLAG](state: StateType): number | null {
    return state.formValues.aiAnalysisBatchFlag
  },
  [types.GETTER_COMMON_EXAMINEES_GET_AI_NAME_MATCH](state: StateType): number | null {
    return state.formValues.aiNameMatch
  },
  [types.GETTER_COMMON_EXAMINEES_GET_MARK_ID](state: StateType): number | null {
    return state.formValues.markId
  },
  [types.GETTER_COMMON_EXAMINEES_GET_SORT_KEY](state: StateType): number | null {
    return state.formValues.sortKey
  },
  [types.GETTER_COMMON_EXAMINEES_GET_SORT_ORDER](state: StateType): number | null {
    return state.formValues.sortOrder
  },
  [types.GETTER_COMMON_EXAMINEES_GET_PAGE](state: StateType): number {
    return state.formValues.page
  },
  // テスター検索結果
  [types.GETTER_COMMON_EXAMINEES_GET_COUNT](state: StateType): number {
    return state.count;
  },
  [types.GETTER_COMMON_EXAMINEES_GET_PAGE_COUNT](state: StateType): number {
    return state.pageCount;
  },
  [types.GETTER_COMMON_EXAMINEES_GET_NORMAL_TESTERS](state: StateType): Tester[] {
    return state.testers;
  },
  [types.GETTER_COMMON_EXAMINEES_GET_SELECTABLE_TESTERS](state: StateType): SelectableTester[] {
    return state.selectableTesters;
  },
  [types.GETTER_COMMON_EXAMINEES_GET_SELECTED_TESTERS](state: StateType): SelectableTester[] {
    const testers:SelectableTester[] = state.selectableTesters;
    return testers.filter(v => v.selected && (v.tester.testId != null));
  },
  [types.GETTER_COMMON_EXAMINEES_GET_HEADER_SELECTED](state: StateType): boolean {
    return state.selectedAll;
  },
}

const mutations: MutationTree<StateType> = {
  // 検索条件の選択肢
  [types.MUTATION_COMMON_EXAMINEES_SET_TESTERS_CONDITIONS](state: StateType, payload: TestersConditions) {
    state.conditions = payload;
  },
  // テスター検索フォーム
  [types.MUTATION_COMMON_EXAMINEES_CLEAR_FORM_VALUES](state: StateType) {
    state.formValues.reset()
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_FORM_VALUES_FOR_DOWNLOAD](state: StateType, payload: CommonExamineesFormValues | null) {
    state.formValuesForDownload = payload
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_GROUP](state: StateType, payload: string) {
    state.formValues.group = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_GROUP_CODE](state: StateType, payload: string) {
    state.formValues.groupCode = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TEST_NAME](state: StateType, payload: string) {
    state.formValues.testName = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_REGION](state: StateType, payload: string) {
    state.formValues.region = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_DATE_FROM](state: StateType, payload: string) {
    state.formValues.testAtDateFrom = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_DATE_TO](state: StateType, payload: string) {
    state.formValues.testAtDateTo = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_TIME_FROM](state: StateType, payload: string) {
    state.formValues.testAtTimeFrom = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_TIME_TO](state: StateType, payload: string) {
    state.formValues.testAtTimeTo = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_LOGIN_ID](state: StateType, payload: string) {
    state.formValues.loginId = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_EXAM_NAME](state: StateType, payload: string) {
    state.formValues.examName = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_IS_LIKE_SEARCH](state: StateType, payload: number) {
    state.formValues.isLikeSearch = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_RECORD](state: StateType, payload: number) {
    state.formValues.record = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_WITH_MARK](state: StateType, payload: number) {
    state.formValues.withMark = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_MARK_ID](state: StateType, payload: number) {
    state.formValues.markId = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_FROM](state: StateType, payload: number) {
    state.formValues.cheatingLevelFrom = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_TO](state: StateType, payload: number) {
    state.formValues.cheatingLevelTo = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_SCORE](state: StateType, payload: number) {
    state.formValues.score = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_AI_ANALYSIS_FLAG](state: StateType, payload: number) {
    state.formValues.aiAnalysisFlag = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_AI_ANALYSIS_BATCH_FLAG](state: StateType, payload: number) {
    state.formValues.aiAnalysisBatchFlag = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_AI_NAME_MATCH](state: StateType, payload: number) {
    state.formValues.aiNameMatch = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_SORT_KEY](state: StateType, payload: number) {
    state.formValues.sortKey = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_SORT_ORDER](state: StateType, payload: number) {
    state.formValues.sortOrder = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_PAGE](state: StateType, payload: number) {
    state.formValues.page = payload;
  },
  // テスター検索結果
  [types.MUTATION_COMMON_EXAMINEES_SET_PAGE_COUNT](state: StateType, payload: number) {
    state.pageCount = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_COUNT](state: StateType, payload: number) {
    state.count = payload;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_TESTERS](state: StateType, payload: Tester[]) {
    state.testers = payload;
    state.selectableTesters = payload.map(tester => {
      const r = new SelectableTester(tester);
      r.disabled = tester.testId == null; // テストIDが存在しないときは選択できない
      return r;
    })
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_SELECTED_OF_TESTERS](state: StateType, payload: {index: number, value: boolean}) {
    state.selectableTesters[payload.index].selected = payload.value;
  },
  [types.MUTATION_COMMON_EXAMINEES_SET_HEADER_SELECTED](state: StateType, payload: boolean) {
    state.selectedAll = payload;
  },
}

const actions: ActionTree<StateType, StateType> = {
  // 検索条件の選択肢
  [types.ACTION_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS](context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testersConditionsTypes.ACTION_TESTERS_CONDITIONS)
        .then((conditions: TestersConditions) => {
          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TESTERS_CONDITIONS, conditions);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  // テスター検索フォーム
  [types.ACTION_COMMON_EXAMINEES_CLEAR_FORM_VALUES](context) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_CLEAR_FORM_VALUES);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_GROUP](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_GROUP, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_GROUP_CODE](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_GROUP_CODE, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_TEST_NAME](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TEST_NAME, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_REGION](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_REGION, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_TEST_AT_DATE_FROM](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_DATE_FROM, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_TEST_AT_DATE_TO](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_DATE_TO, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_TEST_AT_TIME_FROM](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_TIME_FROM, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_TEST_AT_TIME_TO](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TEST_AT_TIME_TO, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_LOGIN_ID](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_LOGIN_ID, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_EXAM_NAME](context, payload: string) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_EXAM_NAME, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_IS_LIKE_SEARCH](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_IS_LIKE_SEARCH, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_RECORD](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_RECORD, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_WITH_MARK](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_WITH_MARK, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_MARK_ID](context, payload: number[]) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_MARK_ID, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_FROM](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_FROM, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_TO](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_CHEATING_LEVEL_TO, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_SCORE](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_SCORE, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_AI_ANALYSIS_FLAG](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_AI_ANALYSIS_FLAG, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_AI_ANALYSIS_BATCH_FLAG](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_AI_ANALYSIS_BATCH_FLAG, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_AI_NAME_MATCH](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_AI_NAME_MATCH, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_SORT_KEY](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_SORT_KEY, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_SORT_ORDER](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_SORT_ORDER, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_PAGE](context, payload: number) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_PAGE, payload);
  },
  // テスター検索結果
  [types.ACTION_COMMON_EXAMINEES_GET_TESTERS](context): Promise<Tester[]> {
    return new Promise((resolve, reject) => {
      const request = context.state.formValues.toTestersRequest()
      context
        .dispatch(testersTypes.ACTION_TESTERS, request)
        .then((result: { count: number, pageCount: number, page: number, testers: Tester[] }) => {
          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_COUNT, result.count);
          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_PAGE_COUNT, result.pageCount);
          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_PAGE, result.page ? result.page : 1);
          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_TESTERS, result.testers);

          context.commit(types.MUTATION_COMMON_EXAMINEES_SET_FORM_VALUES_FOR_DOWNLOAD, context.state.formValues.clone())

          resolve(result.testers);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  [types.ACTION_COMMON_EXAMINEES_DOWNLOAD_TESTERS](context): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (context.state.formValuesForDownload == null) {
        reject(new Error('ダウンロード用の検索パラメータがありません.'))
        return
      }
      const request = context.state.formValuesForDownload!.toTestersRequest()
      context
        .dispatch(testersTypes.ACTION_DOWNLOAD_TESTERS, request)
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(e)
        });
    });
  },
  [types.ACTION_COMMON_EXAMINEES_SET_SELECTED_OF_TESTERS](context, payload: {index: number, value: boolean}) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_SELECTED_OF_TESTERS, payload);
  },
  [types.ACTION_COMMON_EXAMINEES_SET_HEADER_SELECTED](context, payload: boolean) {
    context.commit(types.MUTATION_COMMON_EXAMINEES_SET_HEADER_SELECTED, payload);

    const testers:SelectableTester[] = context.getters[types.GETTER_COMMON_EXAMINEES_GET_SELECTABLE_TESTERS];
    for (let i: number = 0; i < testers.length; i++) {
      if (testers[i].disabled) {
        continue;
      }
      context.dispatch(types.ACTION_COMMON_EXAMINEES_SET_SELECTED_OF_TESTERS, {index: i, value: payload});
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
