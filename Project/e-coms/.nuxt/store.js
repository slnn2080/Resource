import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const VUEX_PROPERTIES = ['state', 'getters', 'actions', 'mutations']

let store = {};

(function updateModules () {
  store = normalizeRoot(require('..\\store\\index.js'), 'store/index.js')

  // If store is an exported method = classic mode (deprecated)

  if (typeof store === 'function') {
    return console.warn('Classic mode for store/ is deprecated and will be removed in Nuxt 3.')
  }

  // Enforce store modules
  store.modules = store.modules || {}

  resolveStoreModules(require('..\\store\\rootStore.ts'), 'rootStore.ts')
  resolveStoreModules(require('..\\store\\const\\endpoint.ts'), 'const/endpoint.ts')
  resolveStoreModules(require('..\\store\\enum\\Actor.ts'), 'enum/Actor.ts')
  resolveStoreModules(require('..\\store\\enum\\ChatItem.ts'), 'enum/ChatItem.ts')
  resolveStoreModules(require('..\\store\\enum\\deviceState.ts'), 'enum/deviceState.ts')
  resolveStoreModules(require('..\\store\\enum\\ExamProcess.ts'), 'enum/ExamProcess.ts')
  resolveStoreModules(require('..\\store\\enum\\HtmlId.ts'), 'enum/HtmlId.ts')
  resolveStoreModules(require('..\\store\\enum\\language.ts'), 'enum/language.ts')
  resolveStoreModules(require('..\\store\\enum\\MatchingStatus.ts'), 'enum/MatchingStatus.ts')
  resolveStoreModules(require('..\\store\\enum\\mediaBitsPerSecond.ts'), 'enum/mediaBitsPerSecond.ts')
  resolveStoreModules(require('..\\store\\enum\\pageTransition.ts'), 'enum/pageTransition.ts')
  resolveStoreModules(require('..\\store\\enum\\StepbarState.ts'), 'enum/StepbarState.ts')
  resolveStoreModules(require('..\\store\\enum\\TesterState.ts'), 'enum/TesterState.ts')
  resolveStoreModules(require('..\\store\\enum\\TestState.ts'), 'enum/TestState.ts')
  resolveStoreModules(require('..\\store\\modules\\accessLimitDeleteStore.ts'), 'modules/accessLimitDeleteStore.ts')
  resolveStoreModules(require('..\\store\\modules\\accessLimitInsertStore.ts'), 'modules/accessLimitInsertStore.ts')
  resolveStoreModules(require('..\\store\\modules\\accessLimitPageStore.ts'), 'modules/accessLimitPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\accessLimitSelectStore.ts'), 'modules/accessLimitSelectStore.ts')
  resolveStoreModules(require('..\\store\\modules\\aiAuthStatusStore.ts'), 'modules/aiAuthStatusStore.ts')
  resolveStoreModules(require('..\\store\\modules\\analysisRequestIndexApiStore.ts'), 'modules/analysisRequestIndexApiStore.ts')
  resolveStoreModules(require('..\\store\\modules\\analysisRequestInitialParamApiStore.ts'), 'modules/analysisRequestInitialParamApiStore.ts')
  resolveStoreModules(require('..\\store\\modules\\analysisRequestPageStore.ts'), 'modules/analysisRequestPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\analysisRequestRequestApiStore.ts'), 'modules/analysisRequestRequestApiStore.ts')
  resolveStoreModules(require('..\\store\\modules\\checkersMonitoringPageStore.ts'), 'modules/checkersMonitoringPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\checkersMonitoringStore.ts'), 'modules/checkersMonitoringStore.ts')
  resolveStoreModules(require('..\\store\\modules\\commonExamineesStore.ts'), 'modules/commonExamineesStore.ts')
  resolveStoreModules(require('..\\store\\modules\\commonStore.ts'), 'modules/commonStore.ts')
  resolveStoreModules(require('..\\store\\modules\\createShortUrlPageStore.ts'), 'modules/createShortUrlPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\createShortUrlStore.ts'), 'modules/createShortUrlStore.ts')
  resolveStoreModules(require('..\\store\\modules\\deletePlanPageStore.ts'), 'modules/deletePlanPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\deletePlanStore.ts'), 'modules/deletePlanStore.ts')
  resolveStoreModules(require('..\\store\\modules\\deleteSettingPageStore.ts'), 'modules/deleteSettingPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\deleteSettingStore.ts'), 'modules/deleteSettingStore.ts')
  resolveStoreModules(require('..\\store\\modules\\deviceLoggingStore.ts'), 'modules/deviceLoggingStore.ts')
  resolveStoreModules(require('..\\store\\modules\\errorStore.ts'), 'modules/errorStore.ts')
  resolveStoreModules(require('..\\store\\modules\\examineeDetailPageStore.ts'), 'modules/examineeDetailPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\examineeLoginPageStore.ts'), 'modules/examineeLoginPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\examineesPageStore.ts'), 'modules/examineesPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\examStatusStore.ts'), 'modules/examStatusStore.ts')
  resolveStoreModules(require('..\\store\\modules\\faceStore.ts'), 'modules/faceStore.ts')
  resolveStoreModules(require('..\\store\\modules\\fixedNotificationsStore.ts'), 'modules/fixedNotificationsStore.ts')
  resolveStoreModules(require('..\\store\\modules\\getMcTokenStore.ts'), 'modules/getMcTokenStore.ts')
  resolveStoreModules(require('..\\store\\modules\\idCardStore.ts'), 'modules/idCardStore.ts')
  resolveStoreModules(require('..\\store\\modules\\kvsReconnectStore.ts'), 'modules/kvsReconnectStore.ts')
  resolveStoreModules(require('..\\store\\modules\\loginsPageStore.ts'), 'modules/loginsPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\loginsStore.ts'), 'modules/loginsStore.ts')
  resolveStoreModules(require('..\\store\\modules\\loginStore.ts'), 'modules/loginStore.ts')
  resolveStoreModules(require('..\\store\\modules\\logReceiveStore.ts'), 'modules/logReceiveStore.ts')
  resolveStoreModules(require('..\\store\\modules\\managementInitialParamStore.ts'), 'modules/managementInitialParamStore.ts')
  resolveStoreModules(require('..\\store\\modules\\managementPageStore.ts'), 'modules/managementPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\managementSummaryStore.ts'), 'modules/managementSummaryStore.ts')
  resolveStoreModules(require('..\\store\\modules\\marksStore.ts'), 'modules/marksStore.ts')
  resolveStoreModules(require('..\\store\\modules\\matchingHistoriesStore.ts'), 'modules/matchingHistoriesStore.ts')
  resolveStoreModules(require('..\\store\\modules\\matchingStore.ts'), 'modules/matchingStore.ts')
  resolveStoreModules(require('..\\store\\modules\\monitorActivateListStore.ts'), 'modules/monitorActivateListStore.ts')
  resolveStoreModules(require('..\\store\\modules\\monitorActivateStore.ts'), 'modules/monitorActivateStore.ts')
  resolveStoreModules(require('..\\store\\modules\\monitorPageStore.ts'), 'modules/monitorPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\proctorAdminPermissionIpStore.ts'), 'modules/proctorAdminPermissionIpStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerDetailStore.ts'), 'modules/testerDetailStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerHeadShotStore.ts'), 'modules/testerHeadShotStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerKickOutStore.ts'), 'modules/testerKickOutStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerMarkingsStore.ts'), 'modules/testerMarkingsStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerPageStore.ts'), 'modules/testerPageStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerRecordingStore.ts'), 'modules/testerRecordingStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerRecordUriStore.ts'), 'modules/testerRecordUriStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerRejectedStore.ts'), 'modules/testerRejectedStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testersConditionsStore.ts'), 'modules/testersConditionsStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testersStore.ts'), 'modules/testersStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testerStore.ts'), 'modules/testerStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testMarkingsStore.ts'), 'modules/testMarkingsStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testPassStore.ts'), 'modules/testPassStore.ts')
  resolveStoreModules(require('..\\store\\modules\\testStatusStore.ts'), 'modules/testStatusStore.ts')
  resolveStoreModules(require('..\\store\\modules\\webrtcMessageStore.ts'), 'modules/webrtcMessageStore.ts')
  resolveStoreModules(require('..\\store\\types\\accessLimitDeleteType.ts'), 'types/accessLimitDeleteType.ts')
  resolveStoreModules(require('..\\store\\types\\accessLimitInsertType.ts'), 'types/accessLimitInsertType.ts')
  resolveStoreModules(require('..\\store\\types\\accessLimitPageType.ts'), 'types/accessLimitPageType.ts')
  resolveStoreModules(require('..\\store\\types\\accessLimitSelectType.ts'), 'types/accessLimitSelectType.ts')
  resolveStoreModules(require('..\\store\\types\\aiAuthStatusType.ts'), 'types/aiAuthStatusType.ts')
  resolveStoreModules(require('..\\store\\types\\analysisRequestIndexApiType.ts'), 'types/analysisRequestIndexApiType.ts')
  resolveStoreModules(require('..\\store\\types\\analysisRequestInitailParamApiType.ts'), 'types/analysisRequestInitailParamApiType.ts')
  resolveStoreModules(require('..\\store\\types\\analysisRequestPageType.ts'), 'types/analysisRequestPageType.ts')
  resolveStoreModules(require('..\\store\\types\\analysisRequestRequestApiType.ts'), 'types/analysisRequestRequestApiType.ts')
  resolveStoreModules(require('..\\store\\types\\checkersMonitoringPageType.ts'), 'types/checkersMonitoringPageType.ts')
  resolveStoreModules(require('..\\store\\types\\checkersMonitoringType.ts'), 'types/checkersMonitoringType.ts')
  resolveStoreModules(require('..\\store\\types\\commonExamineesType.ts'), 'types/commonExamineesType.ts')
  resolveStoreModules(require('..\\store\\types\\commonType.ts'), 'types/commonType.ts')
  resolveStoreModules(require('..\\store\\types\\createShortUrlPageType.ts'), 'types/createShortUrlPageType.ts')
  resolveStoreModules(require('..\\store\\types\\createShortUrlType.ts'), 'types/createShortUrlType.ts')
  resolveStoreModules(require('..\\store\\types\\deletePlanPageType.ts'), 'types/deletePlanPageType.ts')
  resolveStoreModules(require('..\\store\\types\\deletePlanType.ts'), 'types/deletePlanType.ts')
  resolveStoreModules(require('..\\store\\types\\deleteSettingPageType.ts'), 'types/deleteSettingPageType.ts')
  resolveStoreModules(require('..\\store\\types\\deleteSettingType.ts'), 'types/deleteSettingType.ts')
  resolveStoreModules(require('..\\store\\types\\deviceLoggingType.ts'), 'types/deviceLoggingType.ts')
  resolveStoreModules(require('..\\store\\types\\errorType.ts'), 'types/errorType.ts')
  resolveStoreModules(require('..\\store\\types\\examineeDetailPageType.ts'), 'types/examineeDetailPageType.ts')
  resolveStoreModules(require('..\\store\\types\\examineeLoginPageType.ts'), 'types/examineeLoginPageType.ts')
  resolveStoreModules(require('..\\store\\types\\examineesPageType.ts'), 'types/examineesPageType.ts')
  resolveStoreModules(require('..\\store\\types\\examStatusType.ts'), 'types/examStatusType.ts')
  resolveStoreModules(require('..\\store\\types\\faceType.ts'), 'types/faceType.ts')
  resolveStoreModules(require('..\\store\\types\\fixedNotificationsType.ts'), 'types/fixedNotificationsType.ts')
  resolveStoreModules(require('..\\store\\types\\getMcTokenType.ts'), 'types/getMcTokenType.ts')
  resolveStoreModules(require('..\\store\\types\\idCardType.ts'), 'types/idCardType.ts')
  resolveStoreModules(require('..\\store\\types\\kvsReconnectType.ts'), 'types/kvsReconnectType.ts')
  resolveStoreModules(require('..\\store\\types\\loginsPageType.ts'), 'types/loginsPageType.ts')
  resolveStoreModules(require('..\\store\\types\\loginsType.ts'), 'types/loginsType.ts')
  resolveStoreModules(require('..\\store\\types\\loginType.ts'), 'types/loginType.ts')
  resolveStoreModules(require('..\\store\\types\\logReceiveType.ts'), 'types/logReceiveType.ts')
  resolveStoreModules(require('..\\store\\types\\managementInitialParamType.ts'), 'types/managementInitialParamType.ts')
  resolveStoreModules(require('..\\store\\types\\managementPageType.ts'), 'types/managementPageType.ts')
  resolveStoreModules(require('..\\store\\types\\managementSummaryType.ts'), 'types/managementSummaryType.ts')
  resolveStoreModules(require('..\\store\\types\\marksType.ts'), 'types/marksType.ts')
  resolveStoreModules(require('..\\store\\types\\matchingHistoriesType.ts'), 'types/matchingHistoriesType.ts')
  resolveStoreModules(require('..\\store\\types\\matchingType.ts'), 'types/matchingType.ts')
  resolveStoreModules(require('..\\store\\types\\monitorActivateListType.ts'), 'types/monitorActivateListType.ts')
  resolveStoreModules(require('..\\store\\types\\monitorActivateType.ts'), 'types/monitorActivateType.ts')
  resolveStoreModules(require('..\\store\\types\\monitorPageType.ts'), 'types/monitorPageType.ts')
  resolveStoreModules(require('..\\store\\types\\proctorAdminPermissionIpType.ts'), 'types/proctorAdminPermissionIpType.ts')
  resolveStoreModules(require('..\\store\\types\\rootType.ts'), 'types/rootType.ts')
  resolveStoreModules(require('..\\store\\types\\testerDetailType.ts'), 'types/testerDetailType.ts')
  resolveStoreModules(require('..\\store\\types\\testerHeadShotType.ts'), 'types/testerHeadShotType.ts')
  resolveStoreModules(require('..\\store\\types\\testerKickOutType.ts'), 'types/testerKickOutType.ts')
  resolveStoreModules(require('..\\store\\types\\testerMarkingsType.ts'), 'types/testerMarkingsType.ts')
  resolveStoreModules(require('..\\store\\types\\testerPageType.ts'), 'types/testerPageType.ts')
  resolveStoreModules(require('..\\store\\types\\testerRecordingType.ts'), 'types/testerRecordingType.ts')
  resolveStoreModules(require('..\\store\\types\\testerRecordUriType.ts'), 'types/testerRecordUriType.ts')
  resolveStoreModules(require('..\\store\\types\\testerRejectedType.ts'), 'types/testerRejectedType.ts')
  resolveStoreModules(require('..\\store\\types\\testersConditionsType.ts'), 'types/testersConditionsType.ts')
  resolveStoreModules(require('..\\store\\types\\testerStatusType.ts'), 'types/testerStatusType.ts')
  resolveStoreModules(require('..\\store\\types\\testersType.ts'), 'types/testersType.ts')
  resolveStoreModules(require('..\\store\\types\\testerType.ts'), 'types/testerType.ts')
  resolveStoreModules(require('..\\store\\types\\testMarkingsType.ts'), 'types/testMarkingsType.ts')
  resolveStoreModules(require('..\\store\\types\\testPassType.ts'), 'types/testPassType.ts')
  resolveStoreModules(require('..\\store\\types\\testPassTypes.ts'), 'types/testPassTypes.ts')
  resolveStoreModules(require('..\\store\\types\\testStatusType.ts'), 'types/testStatusType.ts')
  resolveStoreModules(require('..\\store\\types\\webrtcMessageType.ts'), 'types/webrtcMessageType.ts')
  resolveStoreModules(require('..\\store\\const\\en\\ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts'), 'const/en/ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts')
  resolveStoreModules(require('..\\store\\const\\en\\ENV_SETTING_TERM_OF_USE_TEXT.ts'), 'const/en/ENV_SETTING_TERM_OF_USE_TEXT.ts')
  resolveStoreModules(require('..\\store\\const\\ja\\ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts'), 'const/ja/ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts')
  resolveStoreModules(require('..\\store\\const\\ja\\ENV_SETTING_TERM_OF_USE_TEXT.ts'), 'const/ja/ENV_SETTING_TERM_OF_USE_TEXT.ts')
  resolveStoreModules(require('..\\store\\const\\ja\\MARKING_LABEL.ts'), 'const/ja/MARKING_LABEL.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\accessLimitDeleteAdapter.ts'), 'types/adapters/accessLimitDeleteAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\accessLimitInsertAdapter.ts'), 'types/adapters/accessLimitInsertAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\accessLimitPageAdapter.ts'), 'types/adapters/accessLimitPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\accessLimitSelectAdapter.ts'), 'types/adapters/accessLimitSelectAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\aiAuthStatusAdapter.ts'), 'types/adapters/aiAuthStatusAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\analysisRequestIndexApiAdapter.ts'), 'types/adapters/analysisRequestIndexApiAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\analysisRequestInitialParamApiAdapter.ts'), 'types/adapters/analysisRequestInitialParamApiAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\analysisRequestPageAdapter.ts'), 'types/adapters/analysisRequestPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\analysisRequestRequestApiAdapter.ts'), 'types/adapters/analysisRequestRequestApiAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\checkersMonitoringAdapter.ts'), 'types/adapters/checkersMonitoringAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\checkersMonitoringPageAdapter.ts'), 'types/adapters/checkersMonitoringPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\commonAdapter.ts'), 'types/adapters/commonAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\commonExamineesAdapter.ts'), 'types/adapters/commonExamineesAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\commonMarkingTimelineAdapter.ts'), 'types/adapters/commonMarkingTimelineAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\createShortUrlAdapter.ts'), 'types/adapters/createShortUrlAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\createShortUrlPageAdapter.ts'), 'types/adapters/createShortUrlPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\deletePlanAdapter.ts'), 'types/adapters/deletePlanAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\deletePlanPageAdapter.ts'), 'types/adapters/deletePlanPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\deleteSettingAdapter.ts'), 'types/adapters/deleteSettingAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\deleteSettingPageAdapter.ts'), 'types/adapters/deleteSettingPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\deviceLoggingAdapter.ts'), 'types/adapters/deviceLoggingAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\errorAdapter.ts'), 'types/adapters/errorAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\examineeDetailPageAdapter.ts'), 'types/adapters/examineeDetailPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\examineeLoginPageAdapter.ts'), 'types/adapters/examineeLoginPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\examineesPageAdapter.ts'), 'types/adapters/examineesPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\examStatusAdapter.ts'), 'types/adapters/examStatusAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\faceAdapter.ts'), 'types/adapters/faceAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\fixedNotificationsAdapter.ts'), 'types/adapters/fixedNotificationsAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\getMcTokenAdapter.ts'), 'types/adapters/getMcTokenAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\idCardAdapter.ts'), 'types/adapters/idCardAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\kvsReconnectAdapter.ts'), 'types/adapters/kvsReconnectAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\loginAdapter.ts'), 'types/adapters/loginAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\loginsAdapter.ts'), 'types/adapters/loginsAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\loginsPageAdapter.ts'), 'types/adapters/loginsPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\logReceiveAdapter.ts'), 'types/adapters/logReceiveAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\managementInitialParamAdapter.ts'), 'types/adapters/managementInitialParamAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\managementPageAdapter.ts'), 'types/adapters/managementPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\managementSummaryAdapter.ts'), 'types/adapters/managementSummaryAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\marksAdapter.ts'), 'types/adapters/marksAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\matchingAdapter.ts'), 'types/adapters/matchingAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\matchingHistoriesAdapter.ts'), 'types/adapters/matchingHistoriesAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\monitorActivateAdapter.ts'), 'types/adapters/monitorActivateAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\monitorActivateListAdapter.ts'), 'types/adapters/monitorActivateListAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\monitorPageAdapter.ts'), 'types/adapters/monitorPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\proctorAdminPermissionIpAdapter.ts'), 'types/adapters/proctorAdminPermissionIpAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\startupAdapter.ts'), 'types/adapters/startupAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerAdapter.ts'), 'types/adapters/testerAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerDetailAdapter.ts'), 'types/adapters/testerDetailAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerHeadShotAdapter.ts'), 'types/adapters/testerHeadShotAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerKickOutAdapter.ts'), 'types/adapters/testerKickOutAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerMarkingsAdapter.ts'), 'types/adapters/testerMarkingsAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerPageAdapter.ts'), 'types/adapters/testerPageAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerRecordingAdapter.ts'), 'types/adapters/testerRecordingAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerRecordUriAdapter.ts'), 'types/adapters/testerRecordUriAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testerRejectedAdapter.ts'), 'types/adapters/testerRejectedAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testersAdapter.ts'), 'types/adapters/testersAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testersConditionsAdapter.ts'), 'types/adapters/testersConditionsAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testMarkingsAdapter.ts'), 'types/adapters/testMarkingsAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testPassAdapter.ts'), 'types/adapters/testPassAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\testStatusAdapter.ts'), 'types/adapters/testStatusAdapter.ts')
  resolveStoreModules(require('..\\store\\types\\adapters\\webrtcMessageAdapter.ts'), 'types/adapters/webrtcMessageAdapter.ts')

  // If the environment supports hot reloading...

  if (process.client && module.hot) {
    // Whenever any Vuex module is updated...
    module.hot.accept([
      '..\\store\\index.js',
      '..\\store\\rootStore.ts',
      '..\\store\\const\\endpoint.ts',
      '..\\store\\enum\\Actor.ts',
      '..\\store\\enum\\ChatItem.ts',
      '..\\store\\enum\\deviceState.ts',
      '..\\store\\enum\\ExamProcess.ts',
      '..\\store\\enum\\HtmlId.ts',
      '..\\store\\enum\\language.ts',
      '..\\store\\enum\\MatchingStatus.ts',
      '..\\store\\enum\\mediaBitsPerSecond.ts',
      '..\\store\\enum\\pageTransition.ts',
      '..\\store\\enum\\StepbarState.ts',
      '..\\store\\enum\\TesterState.ts',
      '..\\store\\enum\\TestState.ts',
      '..\\store\\modules\\accessLimitDeleteStore.ts',
      '..\\store\\modules\\accessLimitInsertStore.ts',
      '..\\store\\modules\\accessLimitPageStore.ts',
      '..\\store\\modules\\accessLimitSelectStore.ts',
      '..\\store\\modules\\aiAuthStatusStore.ts',
      '..\\store\\modules\\analysisRequestIndexApiStore.ts',
      '..\\store\\modules\\analysisRequestInitialParamApiStore.ts',
      '..\\store\\modules\\analysisRequestPageStore.ts',
      '..\\store\\modules\\analysisRequestRequestApiStore.ts',
      '..\\store\\modules\\checkersMonitoringPageStore.ts',
      '..\\store\\modules\\checkersMonitoringStore.ts',
      '..\\store\\modules\\commonExamineesStore.ts',
      '..\\store\\modules\\commonStore.ts',
      '..\\store\\modules\\createShortUrlPageStore.ts',
      '..\\store\\modules\\createShortUrlStore.ts',
      '..\\store\\modules\\deletePlanPageStore.ts',
      '..\\store\\modules\\deletePlanStore.ts',
      '..\\store\\modules\\deleteSettingPageStore.ts',
      '..\\store\\modules\\deleteSettingStore.ts',
      '..\\store\\modules\\deviceLoggingStore.ts',
      '..\\store\\modules\\errorStore.ts',
      '..\\store\\modules\\examineeDetailPageStore.ts',
      '..\\store\\modules\\examineeLoginPageStore.ts',
      '..\\store\\modules\\examineesPageStore.ts',
      '..\\store\\modules\\examStatusStore.ts',
      '..\\store\\modules\\faceStore.ts',
      '..\\store\\modules\\fixedNotificationsStore.ts',
      '..\\store\\modules\\getMcTokenStore.ts',
      '..\\store\\modules\\idCardStore.ts',
      '..\\store\\modules\\kvsReconnectStore.ts',
      '..\\store\\modules\\loginsPageStore.ts',
      '..\\store\\modules\\loginsStore.ts',
      '..\\store\\modules\\loginStore.ts',
      '..\\store\\modules\\logReceiveStore.ts',
      '..\\store\\modules\\managementInitialParamStore.ts',
      '..\\store\\modules\\managementPageStore.ts',
      '..\\store\\modules\\managementSummaryStore.ts',
      '..\\store\\modules\\marksStore.ts',
      '..\\store\\modules\\matchingHistoriesStore.ts',
      '..\\store\\modules\\matchingStore.ts',
      '..\\store\\modules\\monitorActivateListStore.ts',
      '..\\store\\modules\\monitorActivateStore.ts',
      '..\\store\\modules\\monitorPageStore.ts',
      '..\\store\\modules\\proctorAdminPermissionIpStore.ts',
      '..\\store\\modules\\testerDetailStore.ts',
      '..\\store\\modules\\testerHeadShotStore.ts',
      '..\\store\\modules\\testerKickOutStore.ts',
      '..\\store\\modules\\testerMarkingsStore.ts',
      '..\\store\\modules\\testerPageStore.ts',
      '..\\store\\modules\\testerRecordingStore.ts',
      '..\\store\\modules\\testerRecordUriStore.ts',
      '..\\store\\modules\\testerRejectedStore.ts',
      '..\\store\\modules\\testersConditionsStore.ts',
      '..\\store\\modules\\testersStore.ts',
      '..\\store\\modules\\testerStore.ts',
      '..\\store\\modules\\testMarkingsStore.ts',
      '..\\store\\modules\\testPassStore.ts',
      '..\\store\\modules\\testStatusStore.ts',
      '..\\store\\modules\\webrtcMessageStore.ts',
      '..\\store\\types\\accessLimitDeleteType.ts',
      '..\\store\\types\\accessLimitInsertType.ts',
      '..\\store\\types\\accessLimitPageType.ts',
      '..\\store\\types\\accessLimitSelectType.ts',
      '..\\store\\types\\aiAuthStatusType.ts',
      '..\\store\\types\\analysisRequestIndexApiType.ts',
      '..\\store\\types\\analysisRequestInitailParamApiType.ts',
      '..\\store\\types\\analysisRequestPageType.ts',
      '..\\store\\types\\analysisRequestRequestApiType.ts',
      '..\\store\\types\\checkersMonitoringPageType.ts',
      '..\\store\\types\\checkersMonitoringType.ts',
      '..\\store\\types\\commonExamineesType.ts',
      '..\\store\\types\\commonType.ts',
      '..\\store\\types\\createShortUrlPageType.ts',
      '..\\store\\types\\createShortUrlType.ts',
      '..\\store\\types\\deletePlanPageType.ts',
      '..\\store\\types\\deletePlanType.ts',
      '..\\store\\types\\deleteSettingPageType.ts',
      '..\\store\\types\\deleteSettingType.ts',
      '..\\store\\types\\deviceLoggingType.ts',
      '..\\store\\types\\errorType.ts',
      '..\\store\\types\\examineeDetailPageType.ts',
      '..\\store\\types\\examineeLoginPageType.ts',
      '..\\store\\types\\examineesPageType.ts',
      '..\\store\\types\\examStatusType.ts',
      '..\\store\\types\\faceType.ts',
      '..\\store\\types\\fixedNotificationsType.ts',
      '..\\store\\types\\getMcTokenType.ts',
      '..\\store\\types\\idCardType.ts',
      '..\\store\\types\\kvsReconnectType.ts',
      '..\\store\\types\\loginsPageType.ts',
      '..\\store\\types\\loginsType.ts',
      '..\\store\\types\\loginType.ts',
      '..\\store\\types\\logReceiveType.ts',
      '..\\store\\types\\managementInitialParamType.ts',
      '..\\store\\types\\managementPageType.ts',
      '..\\store\\types\\managementSummaryType.ts',
      '..\\store\\types\\marksType.ts',
      '..\\store\\types\\matchingHistoriesType.ts',
      '..\\store\\types\\matchingType.ts',
      '..\\store\\types\\monitorActivateListType.ts',
      '..\\store\\types\\monitorActivateType.ts',
      '..\\store\\types\\monitorPageType.ts',
      '..\\store\\types\\proctorAdminPermissionIpType.ts',
      '..\\store\\types\\rootType.ts',
      '..\\store\\types\\testerDetailType.ts',
      '..\\store\\types\\testerHeadShotType.ts',
      '..\\store\\types\\testerKickOutType.ts',
      '..\\store\\types\\testerMarkingsType.ts',
      '..\\store\\types\\testerPageType.ts',
      '..\\store\\types\\testerRecordingType.ts',
      '..\\store\\types\\testerRecordUriType.ts',
      '..\\store\\types\\testerRejectedType.ts',
      '..\\store\\types\\testersConditionsType.ts',
      '..\\store\\types\\testerStatusType.ts',
      '..\\store\\types\\testersType.ts',
      '..\\store\\types\\testerType.ts',
      '..\\store\\types\\testMarkingsType.ts',
      '..\\store\\types\\testPassType.ts',
      '..\\store\\types\\testPassTypes.ts',
      '..\\store\\types\\testStatusType.ts',
      '..\\store\\types\\webrtcMessageType.ts',
      '..\\store\\const\\en\\ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts',
      '..\\store\\const\\en\\ENV_SETTING_TERM_OF_USE_TEXT.ts',
      '..\\store\\const\\ja\\ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.ts',
      '..\\store\\const\\ja\\ENV_SETTING_TERM_OF_USE_TEXT.ts',
      '..\\store\\const\\ja\\MARKING_LABEL.ts',
      '..\\store\\types\\adapters\\accessLimitDeleteAdapter.ts',
      '..\\store\\types\\adapters\\accessLimitInsertAdapter.ts',
      '..\\store\\types\\adapters\\accessLimitPageAdapter.ts',
      '..\\store\\types\\adapters\\accessLimitSelectAdapter.ts',
      '..\\store\\types\\adapters\\aiAuthStatusAdapter.ts',
      '..\\store\\types\\adapters\\analysisRequestIndexApiAdapter.ts',
      '..\\store\\types\\adapters\\analysisRequestInitialParamApiAdapter.ts',
      '..\\store\\types\\adapters\\analysisRequestPageAdapter.ts',
      '..\\store\\types\\adapters\\analysisRequestRequestApiAdapter.ts',
      '..\\store\\types\\adapters\\checkersMonitoringAdapter.ts',
      '..\\store\\types\\adapters\\checkersMonitoringPageAdapter.ts',
      '..\\store\\types\\adapters\\commonAdapter.ts',
      '..\\store\\types\\adapters\\commonExamineesAdapter.ts',
      '..\\store\\types\\adapters\\commonMarkingTimelineAdapter.ts',
      '..\\store\\types\\adapters\\createShortUrlAdapter.ts',
      '..\\store\\types\\adapters\\createShortUrlPageAdapter.ts',
      '..\\store\\types\\adapters\\deletePlanAdapter.ts',
      '..\\store\\types\\adapters\\deletePlanPageAdapter.ts',
      '..\\store\\types\\adapters\\deleteSettingAdapter.ts',
      '..\\store\\types\\adapters\\deleteSettingPageAdapter.ts',
      '..\\store\\types\\adapters\\deviceLoggingAdapter.ts',
      '..\\store\\types\\adapters\\errorAdapter.ts',
      '..\\store\\types\\adapters\\examineeDetailPageAdapter.ts',
      '..\\store\\types\\adapters\\examineeLoginPageAdapter.ts',
      '..\\store\\types\\adapters\\examineesPageAdapter.ts',
      '..\\store\\types\\adapters\\examStatusAdapter.ts',
      '..\\store\\types\\adapters\\faceAdapter.ts',
      '..\\store\\types\\adapters\\fixedNotificationsAdapter.ts',
      '..\\store\\types\\adapters\\getMcTokenAdapter.ts',
      '..\\store\\types\\adapters\\idCardAdapter.ts',
      '..\\store\\types\\adapters\\kvsReconnectAdapter.ts',
      '..\\store\\types\\adapters\\loginAdapter.ts',
      '..\\store\\types\\adapters\\loginsAdapter.ts',
      '..\\store\\types\\adapters\\loginsPageAdapter.ts',
      '..\\store\\types\\adapters\\logReceiveAdapter.ts',
      '..\\store\\types\\adapters\\managementInitialParamAdapter.ts',
      '..\\store\\types\\adapters\\managementPageAdapter.ts',
      '..\\store\\types\\adapters\\managementSummaryAdapter.ts',
      '..\\store\\types\\adapters\\marksAdapter.ts',
      '..\\store\\types\\adapters\\matchingAdapter.ts',
      '..\\store\\types\\adapters\\matchingHistoriesAdapter.ts',
      '..\\store\\types\\adapters\\monitorActivateAdapter.ts',
      '..\\store\\types\\adapters\\monitorActivateListAdapter.ts',
      '..\\store\\types\\adapters\\monitorPageAdapter.ts',
      '..\\store\\types\\adapters\\proctorAdminPermissionIpAdapter.ts',
      '..\\store\\types\\adapters\\startupAdapter.ts',
      '..\\store\\types\\adapters\\testerAdapter.ts',
      '..\\store\\types\\adapters\\testerDetailAdapter.ts',
      '..\\store\\types\\adapters\\testerHeadShotAdapter.ts',
      '..\\store\\types\\adapters\\testerKickOutAdapter.ts',
      '..\\store\\types\\adapters\\testerMarkingsAdapter.ts',
      '..\\store\\types\\adapters\\testerPageAdapter.ts',
      '..\\store\\types\\adapters\\testerRecordingAdapter.ts',
      '..\\store\\types\\adapters\\testerRecordUriAdapter.ts',
      '..\\store\\types\\adapters\\testerRejectedAdapter.ts',
      '..\\store\\types\\adapters\\testersAdapter.ts',
      '..\\store\\types\\adapters\\testersConditionsAdapter.ts',
      '..\\store\\types\\adapters\\testMarkingsAdapter.ts',
      '..\\store\\types\\adapters\\testPassAdapter.ts',
      '..\\store\\types\\adapters\\testStatusAdapter.ts',
      '..\\store\\types\\adapters\\webrtcMessageAdapter.ts',
    ], () => {
      // Update `root.modules` with the latest definitions.
      updateModules()
      // Trigger a hot update in the store.
      window.$nuxt.$store.hotUpdate(store)
    })
  }
})()

// createStore
export const createStore = store instanceof Function ? store : () => {
  return new Vuex.Store(Object.assign({
    strict: (process.env.NODE_ENV !== 'production')
  }, store))
}

function normalizeRoot (moduleData, filePath) {
  moduleData = moduleData.default || moduleData

  if (moduleData.commit) {
    throw new Error(`[nuxt] ${filePath} should export a method that returns a Vuex instance.`)
  }

  if (typeof moduleData !== 'function') {
    // Avoid TypeError: setting a property that has only a getter when overwriting top level keys
    moduleData = Object.assign({}, moduleData)
  }
  return normalizeModule(moduleData, filePath)
}

function normalizeModule (moduleData, filePath) {
  if (moduleData.state && typeof moduleData.state !== 'function') {
    console.warn(`'state' should be a method that returns an object in ${filePath}`)

    const state = Object.assign({}, moduleData.state)
    // Avoid TypeError: setting a property that has only a getter when overwriting top level keys
    moduleData = Object.assign({}, moduleData, { state: () => state })
  }
  return moduleData
}

function resolveStoreModules (moduleData, filename) {
  moduleData = moduleData.default || moduleData
  // Remove store src + extension (./foo/index.js -> foo/index)
  const namespace = filename.replace(/\.(js|mjs|ts)$/, '')
  const namespaces = namespace.split('/')
  let moduleName = namespaces[namespaces.length - 1]
  const filePath = `store/${filename}`

  moduleData = moduleName === 'state'
    ? normalizeState(moduleData, filePath)
    : normalizeModule(moduleData, filePath)

  // If src is a known Vuex property
  if (VUEX_PROPERTIES.includes(moduleName)) {
    const property = moduleName
    const propertyStoreModule = getStoreModule(store, namespaces, { isProperty: true })

    // Replace state since it's a function
    mergeProperty(propertyStoreModule, moduleData, property)
    return
  }

  // If file is foo/index.js, it should be saved as foo
  const isIndexModule = (moduleName === 'index')
  if (isIndexModule) {
    namespaces.pop()
    moduleName = namespaces[namespaces.length - 1]
  }

  const storeModule = getStoreModule(store, namespaces)

  for (const property of VUEX_PROPERTIES) {
    mergeProperty(storeModule, moduleData[property], property)
  }

  if (moduleData.namespaced === false) {
    delete storeModule.namespaced
  }
}

function normalizeState (moduleData, filePath) {
  if (typeof moduleData !== 'function') {
    console.warn(`${filePath} should export a method that returns an object`)
    const state = Object.assign({}, moduleData)
    return () => state
  }
  return normalizeModule(moduleData, filePath)
}

function getStoreModule (storeModule, namespaces, { isProperty = false } = {}) {
  // If ./mutations.js
  if (!namespaces.length || (isProperty && namespaces.length === 1)) {
    return storeModule
  }

  const namespace = namespaces.shift()

  storeModule.modules[namespace] = storeModule.modules[namespace] || {}
  storeModule.modules[namespace].namespaced = true
  storeModule.modules[namespace].modules = storeModule.modules[namespace].modules || {}

  return getStoreModule(storeModule.modules[namespace], namespaces, { isProperty })
}

function mergeProperty (storeModule, moduleData, property) {
  if (!moduleData) {
    return
  }

  if (property === 'state') {
    storeModule.state = moduleData || storeModule.state
  } else {
    storeModule[property] = Object.assign({}, storeModule[property], moduleData)
  }
}
