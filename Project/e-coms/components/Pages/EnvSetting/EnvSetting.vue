<template>
  <main class="main">
    <div class="container">
      <div class="mt-5 mb-5">
        <Stepbar />
        <div class="card">
          <div class="card-body">
            <div v-show="clickError" class="alert alert-warning">{{ displayLang.ENV_SETTING_NETWORK_ERROR }}</div>
            <div v-if="displayChromeNotClickReload" class="alert alert-warning">{{ displayLang.ENV_SETTING_CHROME_NOT_CLICK_RELOAD }}</div>
            <EnvSettingChecker check-value:="isToCheckCameraMike" />
            <EnvSettingTerm />
            <div class="custom-control custom-checkbox terms-check mb-4">
              <input
                id="termscheck"
                value="selectData.isProcterTermAgree"
                type="checkbox"
                class="custom-control-input"
                :disabled="!selectData.isProcterTermRead"
                @change="onChangeAgree()"
              />
              <label class="custom-control-label" for="termscheck">
                {{ displayLang.ENV_SETTING_AGREE_TERM_OF_USE }}
              </label>
            </div>
          </div>
          <div class="card-footer text-center">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!enableNextButton()"
              @click.prevent="onClickNext"
            >{{ displayLang.ENV_SETTING_NEXT }}</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '../../../store/types/adapters/startupAdapter';
import { TesterState } from '../../../store/enum/TesterState';
import { TesterPageAdapter } from '../../../store/types/adapters/testerPageAdapter';
import { StepbarState } from '../../../store/enum/StepbarState';
import Stepbar from '@/components/Common/Stepbar.vue';
import EnvSettingTerm from '@/components/Pages/EnvSetting/Childs/EnvSettingTerm.vue';
import EnvSettingChecker from '@/components/Pages/EnvSetting/Childs/EnvSettingChecker.vue';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/testerPageType';
import * as commonTypes from '@/store/types/commonType';
import {
  DeviceLoggingAdapter,
  DeviceLoggingRequestType,
} from '@/store/types/adapters/deviceLoggingAdapter';
import * as deviceLoggingTypes from '@/store/types/deviceLoggingType';
import { LanguageEnum } from '@/store/enum/language';
import { DeviceState } from '@/store/enum/deviceState';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import * as loginTypes from '@/store/types/loginType';
import {
  MediaStreamResultType,
} from '@/plugins/global/mediaDevices';
import TesterMatchingPollingMixin from '@/components/Mixins/TesterMatchingPollingMixin';

export default Vue.extend({
  components: {
    Stepbar,
    EnvSettingTerm,
    EnvSettingChecker
  },
  mixins: [
    TesterMatchingPollingMixin,
  ],
  data() {
    return {
      isConfirmEnvSettings: false,
      isAgreeTerm: false,
      isToCheckCameraMike: false,
      nextClicked: false,
      isAuthenticated: false,
      clickError: false,
      displayChromeNotClickReload: false,
      DeviceState,
    };
  },
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    selectData(): TesterPageAdapter {
      return this.$store.getters[pageTypes.GETTER_TESTER_PAGE];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
  },
  created() {
    if (this.inParams.isAuth === 1 || this.inParams.isProctor === 1 || this.inParams.isRecord === 1) {
      this.$mediaDevices.createFrontCameraMediaStream(true, true)
        .then((value: MediaStreamResultType) => {
          this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_ENABLE_CAMERA, value.isEnableVideo ? DeviceState.ALLOWED : DeviceState.DENIED);
          this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_ENABLE_MICROPHONE, value.isEnableAudio ? DeviceState.ALLOWED : DeviceState.DENIED);

          if (!value.isEnableVideo || !value.isEnableAudio) {
            this.displayChromeNotClickReload = true;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  methods: {
    // 各デバイスチェック・同意が行われた時に活性化させる。
    enableNextButton() {
      // 「監視利用をする」は、「カメラ・マイク・利用規約チェック」全てをチェック有無確認
      // 「監視利用をしない」は、「利用規約チェック」のチェック有無だけを確認
      if (this.inParams.isAuth === 1 || this.inParams.isProctor === 1 || this.inParams.isRecord === 1) {
        return (
          this.selectData.enableCamera === DeviceState.ALLOWED &&
          this.selectData.enableMicrophone === DeviceState.ALLOWED &&
          this.selectData.isProcterTermAgree
        );
      } else {
        return this.selectData.isProcterTermAgree;
      }

    },
    /**
     * 「次へ」ボタンのイベントハンドラ
     */
    onClickNext() {
      if (this.nextClicked) {
        return;
      }
      this.nextClicked = true;
      this.clickError = false;
      if (this.loginData.kicked === 1) {
        this.$router.replace('/alerting/kicked');
        return;
      }

      // 「AI本人認証」の場合２
      // 「監視者」の場合１
      /////////////////////////////
      /// ------------------------------AI蓋開け：コメント外す
      if (this.inParams.isAiAuth == 2) {
        // 認証種類:AI

        this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
          .then(() => this.postDeviceSpec())
          .then(() => new Promise((resolve, reject) => {
            this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE, StepbarState.IDENTIFICATION);
            this.$router.replace('/identification-ai')
              .then(() => resolve(true))
              .catch(reject)
          }))
          .catch((error) => this.displayError(error))
          .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
      } else {
        // 認証種類:監視者

        if (this.inParams.isAuth == 0) {
          // 認証なし

          if (this.inParams.isProctor == 1) {
            // 認証なし/監視あり

            this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
              .then(() => this.postDeviceSpec())
              .then(() => new Promise((resolve, reject) => {
                ;(this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false})
                  .then(() => {
                    console.log('-------------------------------------examining2.1');
                    // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
                    this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
                      .then(() => this.$router.replace('/examining'))
                      .then(() => resolve(true))
                      .catch(reject)
                  })
                  .catch(reject)
              }))
              .catch((error) => this.displayError(error))
              .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
          } else {
            // 認証なし/監視なし

            this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
              .then(() => this.postDeviceSpec())
              .then(() => new Promise((resolve, reject) => {
                console.log('-------------------------------------examining2.2');
                // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
                this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
                  .then(() => this.$router.replace('/examining'))
                  .then(() => resolve(true))
                  .catch(reject)
              }))
              .catch((error) => this.displayError(error))
              .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
          }
        } else {
          // 認証あり

          if (this.inParams.isProctor == 1) {
            // 認証あり/監視あり

            this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
              .then(() => this.postDeviceSpec())
              .then(() => new Promise((resolve, reject) => {
                //認証しているかチェック
                this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_TESTER_AUTHENTICATED).then((isAuthenticated) => {
                  this.isAuthenticated = isAuthenticated;
                  if (this.isAuthenticated) {
                    // 認証済み
                    ;(this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false})
                      .then(() => {
                        console.log('-------------------------------------examining3');
                        // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
                        this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
                          .then(() => this.$router.replace('/examining'))
                          .then(() => resolve(true))
                          .catch(reject)
                      })
                      .catch(reject)
                  } else {
                    // 未認証
                    ;(this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false}) // 「認証」画面遷移の場合は、「認証」画面側でマッチングの完了を待つ
                      .then(() => {
                        console.log('-------------------------------------identification3');
                        // このタイミングでは、matching.phpの初回呼び出しで、TesterState.MATCHEDにステータス変更が行われている。
                        // this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.MATCHED)
                        Promise.resolve(true)
                          .then(() => this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE, StepbarState.IDENTIFICATION))
                          .then(() => this.$router.replace('/identification'))
                          .then(() => resolve(true))
                          .catch(reject)
                      })
                      .catch(reject)
                  }
                })
              }))
              .catch((error) => this.displayError(error))
              .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
          } else {
            // 認証あり/監視なし

            this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
              .then(() => this.postDeviceSpec())
              .then(() => new Promise((resolve, reject) => {
                ;(this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false})  // 「認証」画面遷移の場合は、「認証」画面側でマッチングの完了を待つ
                  .then(() => {
                    console.log('-------------------------------------identification4');
                    // このタイミングでは、matching.phpの初回呼び出しで、TesterState.MATCHEDにステータス変更が行われている。
                    // this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.MATCHED)
                    Promise.resolve(true)
                      .then(() => this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE, StepbarState.IDENTIFICATION))
                      .then(() => this.$router.replace('/identification'))
                      .then(() => resolve(true))
                      .catch(reject)
                  })
                  .catch(reject)
              }))
              .catch((error) => this.displayError(error))
              .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
          }
        }
      }
    },
    displayError(error: any) {
      console.log(error);
      this.clickError = true;
      this.nextClicked = false;
    },
    /**
     * デバイス情報をサーバに送信します
     *
     * @return {Promise<boolean>}
     */
    postDeviceSpec(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const currentVideoDeviceId = this.$mediaDevices.storage.getCurrentVideoDeviceId()
        const deviceInfo = this.$mediaDevices.storage.getCurrentVideoDeviceInfo()

        const request = {
          // @ts-ignore
          is_pc:             this.$ua.isFromPc(),
          current_device_id: currentVideoDeviceId,
          device_id:         (deviceInfo == null ? null : deviceInfo.deviceId),
          group_id:          (deviceInfo == null ? null : deviceInfo.groupId),
          kind:              (deviceInfo == null ? null : deviceInfo.kind),
          label:             (deviceInfo == null ? null : deviceInfo.label),
          json:              (deviceInfo == null ? null : JSON.stringify(deviceInfo)),
        } as DeviceLoggingRequestType;

        this.$store.dispatch(deviceLoggingTypes.ACTION_DEVICE_LOGGING, request)
          .then((adapter: DeviceLoggingAdapter) => {})
          .catch((e) => {})
          .finally(() => {
            // TODO: このAPI呼び出しで失敗しても処理の流れに影響を与えないように常に成功とする
            resolve(true)
          })
      })
    },
    /**
     * 「利用規約に同意します」チェックボックスのイベントハンドラ
     */
    onChangeAgree() {
      this.$store.dispatch(
        pageTypes.ACTION_TESTER_PAGE_PROCTER_TERM_AGREE,
        !this.selectData.isProcterTermAgree
      );
      this.switchStepbarState();
    },
    switchStepbarState() {
      if (this.selectData.isProcterTermAgree) {
        this.changeStepbarState(StepbarState.TERM_AGREE);
      } else {
        this.changeStepbarState(StepbarState.ENV_SETTING);
      }
    },
    changeStepbarState(state: StepbarState) {
      this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE, state);
    },
  }
});
</script>
