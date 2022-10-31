<template>
  <form class="form-signin">
    <div
      v-if="isTester"
      class="card mb-4"
    >
      <div class="card-header text-center">{{ displayLang.LOGIN_USE_ENVIRONMENT_CHECK }}</div>
      <div class="card-body checker-thumb">
        <div class="row no-gutters">
          <div class="col-md-5">
            <div class="video-container">
              <div class="video-wrap">
                <video
                  ref="videoElement"
                  id="video"
                  playsinline="true"
                  autoplay
                  muted=""
                  style="width: 100%; height: auto;"
                ></video>
                <div class="media-info">
                  <i class="fa fa-video-camera" aria-hidden="true"></i>
                  <span class="media-status">LIVE</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-7">
            <div class="mb-2">{{ displayLang.LOGIN_USE_ENVIRONMENT_CHECK_MESSAGE }}</div>
            <a
              class="btn btn-secondary"
              href="javascript: void 0;"
              @click.prevent="onClickChecker"
            ><i class="fa fa-check-square-o" aria-hidden="true"></i>{{ displayLang.LOGIN_USE_ENVIRONMENT_CHECK }}</a>
          </div>
        </div>
        <!-- PCの時のみ表示 -->
        <div
          class="mt-3 row no-gutters"
          v-if="$ua.isFromPc()"
        >
          <div class="col-md-5"><label class="mt-2">{{ displayLang.LOGIN_USE_CAMERA_DEVICE }}</label></div>
          <div class="col-md-7">
            <select
              class="form-control"
              :value="getCurrentVideoDeviceId()"
              @change="(event) => { setCurrentVideoDeviceId(event.currentTarget.value) }"
            >
              <template v-if="videoDevices.length == 0">
                <option :value="''">{{ displayLang.LOGIN_NOT_EXISTS_CAMERA_DEVICE }}</option>
              </template>
              <template v-else>
                <template v-for="(item, devices) in videoDevices">
                  <option :key="devices" :value="item.deviceId">{{ item.label }}</option>
                </template>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header text-center">LOGIN{{ displayActor }}</div>
      <div class="card-body">
        <div v-if="message !== ''" class="alert alert-danger">{{ message }}</div>
        <ValidationObserver ref="obs" v-slot="obsProps">
          <ValidationProvider v-slot="{ errors }" :name="displayLang.LOGIN_ID" rules="required">
            <div class="form-group" :class="{ error: errors.length !== 0 }">
              <label :for="displayLang.LOGIN_ID">{{ displayLang.LOGIN_ID }}</label>
              <input :id="displayLang.LOGIN_ID" v-model="id" type="text" class="form-control" />
              <p class="help-block">{{ errors[0] }}</p>
            </div>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" :name="displayLang.LOGIN_PASSWORD" rules="required">
            <div class="form-group" :class="{ error: errors.length !== 0 }">
              <label :for="displayLang.LOGIN_PASSWORD">{{ displayLang.LOGIN_PASSWORD }}</label>
              <input
                :id="displayLang.LOGIN_PASSWORD"
                v-model="pass"
                type="password"
                class="form-control"
              />
              <p class="help-block">{{ errors[0] }}</p>
            </div>
          </ValidationProvider>
          <div class="mb-4">
            <ForgetPassword />
          </div>
          <button
            class="btn btn-lg btn-primary btn-block"
            type="button"
            @click.prevent="onClickLogin(obsProps)"
          >{{ displayLang.LOGIN }}</button>
        </ValidationObserver>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import ForgetPassword from './ForgetPassword.vue';
import { Actor, ActorUtils } from '@/store/enum/Actor';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import { PagePathUtils } from '@/store/enum/pageTransition';
import { MediaStreamResultType, MediaStreamHandler } from '@/plugins/global/mediaDevices';

export default Vue.extend({
  components: {
    ForgetPassword
  },
  data() {
    return {
      id: '' as string,
      pass: '' as string,
      message: '' as string,

      videoDevices: [] as MediaDeviceInfo[],
      currentVideoDeviceId: '' as (string | null),
      mediaStreamHandler: {} as MediaStreamHandler,
    };
  },
  mounted() {
    this.streamDevicesMediaStream()
  },
  beforeDestroy() {
    if (this.isTester) {
      this.$mediaDevices.removeMediaStreamHandler(this.mediaStreamHandler as MediaStreamHandler)
      this.detachMediaStream();

      this.$mediaDevices.releaseCameraMediaStream();
    }
  },
  computed: {
    ...mapGetters({ inParams: rootTypes.GETTER_STARTUP }),
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    displayActor(): string {
      const actor = this.actor;
      if (actor.length === 0) {
        this.$router.replace('/alerting/system-error/')
        return actor;
      } else {
        return `（${actor}）`;
      }
    },
    actor(): string {
      return ActorUtils.toString(this.inParams.actor as Actor, this.displayLang);
    },
    /**
     * 「受験者」か調べます
     *
     * @return {boolean}
     */
    isTester(): boolean {
      return this.inParams.actor == Actor.TESTER
    },
  },
  methods: {
    /**
     * 「ログイン」ボタンのイベントハンドラ
     *
     * @param {any} valid
     * @see https://vee-validate.logaretm.com/v3/api/validation-observer.html#scoped-slot-props
     */
    async onClickLogin(valid: any) {
      try {
        // 「ログイン」ボタン押下したら、ログインAPI完了まで押下できないように処理に読み込みフィルタをかける
        this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)

        const res = await this.$store.dispatch(loginTypes.ACTION_LOGIN, {
          login_id: this.id,
          password: this.pass
        });
        if (res.status !== 200) {
          // API失敗

          this.message = res.message;
          if (res.result) {
            const id = res.result.login_id;
            const password = res.result.password;
            if (id) {
              valid.errors[this.displayLang.LOGIN_ID].push(id);
            }
            if (password) {
              valid.errors[this.displayLang.LOGIN_PASSWORD].push(password);
            }
          }
        } else {
          // API成功

          // 画面遷移
          const actor = res.result.actor
          await this.$router.replace(PagePathUtils.getFirstPagePath(actor));
        }
      } catch (error) {
        // API失敗
        console.error(error);
        alert(error);
        this.$router.replace('/login');
      } finally {
        // 読み込みフィルタを解除する
        this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false)
      }
    },
    /**
     * 「利用環境チェック」ボタンのイベントハンドラ
     */
    onClickChecker() {
      this.$router.replace(`/iframe?page=checker`)
    },
    /**
     * <video>タグにメディアストリームをアタッチします
     *
     * @param {MediaStream | null} mediaStream
     */
    attachMediaStream(mediaStream: MediaStream | null) {
      const videoTag = this.$refs.videoElement as HTMLVideoElement;
      if (videoTag) {
        this.$htmlElementUtils.videoElement.setSrcObject(videoTag, mediaStream)
      }
    },
    /**
     * <video>タグからメディアストリームをデタッチします
     */
    detachMediaStream() {
      this.attachMediaStream(null);
    },
    /**
     * [PC] カレントなdeviceID
     */
    initCurrentVideoDeviceId() {
      this.$set(this, 'currentVideoDeviceId', this.$mediaDevices.storage.getCurrentVideoDeviceId())
    },
    /**
     * [PC] カレントなdeviceID
     *
     * @return {string | null}
     */
    getCurrentVideoDeviceId(): string | null {
      return this.currentVideoDeviceId
    },
    /**
     * [PC] カレントなdeviceID
     *
     * @param {string | null} videoDeviceId
     */
    setCurrentVideoDeviceId(videoDeviceId: string | null) {
      if (!videoDeviceId) {
        this.$mediaDevices.storage.setCurrentVideoDeviceId(null)
        this.$set(this, 'currentVideoDeviceId', videoDeviceId)
      } else {
        if (videoDeviceId !== window.localStorage.getItem('currentVideoDeviceId')) {
          // メディアストリームを切り替える前に、直前のメディアストリームを解放する
          this.$mediaDevices.releaseCameraMediaStream();
          this.setCurrentDeviceIdAndcreateNewMediaStream(videoDeviceId)
          this.streamDevicesMediaStream()
        }
        this.setCurrentDeviceIdAndcreateNewMediaStream(videoDeviceId)
      }
    },
    /**
     * [SP] メディアデバイスを検索してvideoタグにアタッチします
     */
    findAndAttachDeviceStream() {
      this.$mediaDevices.createFrontCameraMediaStream(true, true)
    },
    /**
     * カメラデバイスから入力されたメディアストリームを流す
     */
    streamDevicesMediaStream() {
      if (this.isTester) {
        this.mediaStreamHandler = {
          onCameraMediaStreamCreated: (mediaStreamResult: MediaStreamResultType):Promise<boolean> => {
            this.attachMediaStream(mediaStreamResult.mediaStream)
            return Promise.resolve(true)
          },
          onCameraMediaStreamReset: (mediaStreamResult: MediaStreamResultType):Promise<boolean> => {
            this.attachMediaStream(mediaStreamResult.mediaStream)
            return Promise.resolve(true)
          },
        } as MediaStreamHandler
        this.$mediaDevices.addMediaStreamHandler(this.mediaStreamHandler as MediaStreamHandler)

        // TODO: $uaがtypescript通らないので暫定処置
        // @ts-ignore
        if (this.$ua.isFromPc()) {
          // PCの場合
          // ユーザにデバイスの選択をさせ、選択がなされたらデバイスストリームを設定します

          this.$mediaDevices.getDeviceInfoList()
            .then((deviceResult) => {
              if (deviceResult.videoSuccess && (deviceResult.videoInputs.length > 0)) {
                // デバイス列挙成功

                this.initCurrentVideoDeviceId()
                this.$set(
                  this,
                  'videoDevices',
                  deviceResult.videoInputs
                )

                let deviceId: string | null = this.getCurrentVideoDeviceId()
                if (!deviceResult.videoInputs.some((v) => v.deviceId === deviceId)) {
                  deviceId = (deviceResult.videoInputs.length > 0)
                    ? deviceResult.videoInputs[0].deviceId
                    : null
                }

                // selectbox の初期化がうまく行われないので次のタスクで行う
                this.$nextTick(() => {
                  this.setCurrentVideoDeviceId(deviceId)
                  this.$forceUpdate()
                })
              } else {
                // デバイス列挙失敗
                console.error('[ERROR] デバイスの列挙に失敗しました')
              }
            })
            .catch((e) => {
              console.error('[ERROR] デバイスの列挙に失敗しました', e)
            })
        } else {
          // PC以外の場合
          // 最適なデバイスストリームを設定します

          this.findAndAttachDeviceStream()
        }
      }
    },
    /**
     * カメラデバイスIDの設定と新しいメディアストリームを生成
     */
    setCurrentDeviceIdAndcreateNewMediaStream(videoDeviceId: string): void {
      this.$mediaDevices.storage.setCurrentVideoDeviceId(videoDeviceId)
      this.$set(this, 'currentVideoDeviceId', videoDeviceId)
      this.$mediaDevices.createFrontCameraMediaStream(true, true)
    }
  }
});
</script>
