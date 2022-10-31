/* eslint-disable import/first */
import Vuex from 'vuex';

import rootStore from './rootStore';
import commonStore from './modules/commonStore';
import commonExamineesStore from './modules/commonExamineesStore';
import loginStore from './modules/loginStore';
import logReceiveStore from './modules/logReceiveStore';
import deviceLoggingStore from './modules/deviceLoggingStore';
import monitorPageStore from './modules/monitorPageStore';
import testerStore from './modules/testerStore';
import testerRecordingStore from './modules/testerRecordingStore';
import testerRecordUriStore from './modules/testerRecordUriStore';
import testerHeadShotStore from './modules/testerHeadShotStore';
import testerPageStore from './modules/testerPageStore';
import matchingStore from './modules/matchingStore';
import matchingHistoriesStore from './modules/matchingHistoriesStore';
import kvsReconnectStore from './modules/kvsReconnectStore';
import testMarkingsStore from './modules/testMarkingsStore';
import testerMarkingsStore from './modules/testerMarkingsStore';
import errorStore from './modules/errorStore';
import testStatusStore from './modules/testStatusStore';
import examStatusStore from './modules/examStatusStore';
import getMcTokenStore from './modules/getMcTokenStore';
import testerKickOutStore from './modules/testerKickOutStore';
import managementInitialParamStore from './modules/managementInitialParamStore';
import managementSummaryStore from './modules/managementSummaryStore';
import managementPageStore from './modules/managementPageStore';
import accessLimitSelectStore from './modules/accessLimitSelectStore';
import accessLimitInsertStore from './modules/accessLimitInsertStore';
import accessLimitDeleteStore from './modules/accessLimitDeleteStore';
import accessLimitPageStore from './modules/accessLimitPageStore';
import analysisRequestInitialParamApiStore from './modules/analysisRequestInitialParamApiStore';
import analysisRequestRequestApiStore from './modules/analysisRequestRequestApiStore';
import analysisRequestIndexApiStore from './modules/analysisRequestIndexApiStore';
import analysisRequestPageStore from './modules/analysisRequestPageStore';
import loginsStore from './modules/loginsStore';
import loginsPageStore from './modules/loginsPageStore';
import deletePlanStore from './modules/deletePlanStore';
import deletePlanPageStore from './modules/deletePlanPageStore';
import deleteSettingStore from './modules/deleteSettingStore';
import deleteSettingPageStore from './modules/deleteSettingPageStore';
import testersStore from './modules/testersStore';
import examineesPageStore from './modules/examineesPageStore';
import testersConditionsStore from './modules/testersConditionsStore';
import testerDetailStore from './modules/testerDetailStore';
import testPassStore from './modules/testPassStore';
import examineeDetailPageStore from './modules/examineeDetailPageStore';
import checkersMonitoringStore from '~/store/modules/checkersMonitoringStore';
import checkersMonitoringPageStore from '@/store/modules/checkersMonitoringPageStore';
import testerRejectedStore from '@/store/modules/testerRejectedStore';
import webrtcMessageStore from '@/store/modules/webrtcMessageStore';
import examineeLoginPageStore from '@/store/modules/examineeLoginPageStore';
import fixedNotificationsStore from '@/store/modules/fixedNotificationsStore';
import marksStore from '@/store/modules/marksStore';
import monitorActivateStore from '@/store/modules/monitorActivateStore';
import monitorActivateListStore from '@/store/modules/monitorActivateListStore';
import faceStore from '@/store/modules/faceStore';
import idCardStore from '@/store/modules/idCardStore';
import aiAuthStatusStore from '@/store/modules/aiAuthStatusStore';
import createShortUrlStore from '@/store/modules/createShortUrlStore';
import createShortUrlPageStore from '@/store/modules/createShortUrlPageStore';
import proctorAdminPermissionIpStore from '@/store/modules/proctorAdminPermissionIpStore';

const createStore = () => {
  return new Vuex.Store({
    ...rootStore,
    modules: {
      commonStore,
      commonExamineesStore,
      loginStore,
      logReceiveStore,
      deviceLoggingStore,
      monitorPageStore,
      testerStore,
      testerRecordingStore,
      testerRecordUriStore,
      testerHeadShotStore,
      testerPageStore,
      matchingStore,
      matchingHistoriesStore,
      kvsReconnectStore,
      testMarkingsStore,
      testerMarkingsStore,
      errorStore,
      testStatusStore,
      examStatusStore,
      getMcTokenStore,
      testerKickOutStore,
      managementInitialParamStore,
      managementSummaryStore,
      managementPageStore,
      accessLimitSelectStore,
      accessLimitInsertStore,
      accessLimitDeleteStore,
      accessLimitPageStore,
      analysisRequestInitialParamApiStore,
      analysisRequestRequestApiStore,
      analysisRequestIndexApiStore,
      analysisRequestPageStore,
      loginsStore,
      loginsPageStore,
      deletePlanStore,
      deletePlanPageStore,
      deleteSettingStore,
      deleteSettingPageStore,
      testersStore,
      examineesPageStore,
      testersConditionsStore,
      testerDetailStore,
      testPassStore,
      examineeDetailPageStore,
      checkersMonitoringStore,
      checkersMonitoringPageStore,
      testerRejectedStore,
      webrtcMessageStore,
      examineeLoginPageStore,
      fixedNotificationsStore,
      marksStore,
      monitorActivateStore,
      monitorActivateListStore,
      faceStore,
      idCardStore,
      aiAuthStatusStore,
      createShortUrlStore,
      createShortUrlPageStore,
      proctorAdminPermissionIpStore,
    }
  });
};

export default createStore;
