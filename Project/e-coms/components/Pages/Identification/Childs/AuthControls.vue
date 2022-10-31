<template>
  <div class="auth-video-control">  
    <div class="proctor-message-area message-caution" v-if="noticeType === 1">{{ noticeAiDisplay }}</div>
    <div class="proctor-message-area message-error" v-else-if="noticeType === 2">{{ noticeAiDisplay}}</div>
    <div class="auth-video-btn">    
      <template v-if="!nextBtnFlg">        
        <button
          v-if="!takeBtnChange && takeBtnFlag && isFirstCheck()"
          type="button"
          class="btn btn-primary"
          :disabled="canClick()"
          @click="throttle(takeIdentificationImage)"
        >
          <!-- 撮影 -->
          {{ displayLang.AI_IDENTIFICATION_TAKE_PHOTO }}
        </button>
        
        <template v-else-if="takeBtnChange && takeBtnFlag">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="disabled"
            @click="throttle(registerIdentificationImage)"
          >
            <!-- この画像を登録 -->
            {{ displayLang.AI_IDENTIFICATION_REGISTRATION }}
          </button>
          <div v-if="isMobile()"><br /></div>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="disabled"
            @click="throttle(retakeIdentificationImage)"
          >
            <!-- 撮り直し -->
            {{ displayLang.AI_IDENTIFICATION_RETAKE_PHOTO }}
          </button>
        </template>
      </template>
               
    </div>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue';
  import { throttle } from 'lodash';
  import * as rootTypes from '@/store/types/rootType';
  import * as testerPageTypes from '@/store/types/testerPageType';
  import * as testerTypes from '@/store/types/testerType';
  import * as matchingType from '@/store/types/matchingType';
  import * as faceType from '@/store/types/faceType';
  import * as idCardType from '@/store/types/idCardType';
  import * as loginTypes from '@/store/types/loginType';
  import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
  import StartupAdapter from '@/store/types/adapters/startupAdapter';
  import { Matching } from '@/store/types/adapters/matchingAdapter';

  import { TesterState } from '~/store/enum/TesterState';
  import { LanguageEnum } from '@/store/enum/language';
  import { FaceAdapter, FaceRequestType } from '~/store/types/adapters/faceAdapter';
  import { IdCardAdapter } from '~/store/types/adapters/idCardAdapter';
  import { MediaStreamResultType } from '~/plugins/global/mediaDevices';
  import {DeviceState} from "~/store/enum/deviceState";

  export default Vue.extend({
    name: 'AuthControls',
    props: {
      snapshotImage: {
        type: Function,
        required: true
      },
      acceptImage: {
        type: Function,
        required: true
      },
    },
    data() {
      return {
        status: 0,
        faceUrl: '',
        idCardUrl: '',
        takeBtnChange: false,
        takeBtnFlag: true,
        image: '',
        throttle: throttle((fn) => fn(), 1000),
        disabled: false,
        nextBtnFlg: false,
        isFront: true,
        isDisabled: true,
        isDefault : false,
      };
    },
    watch: {
      // isDefaultが変化した時に発火する
      isDefault(){
        setTimeout(() => this.enable(), 3000);
      }
    },
    computed: {
      displayLang(): LanguageEnum {
        return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
      },
      testerPage(): TesterPageAdapter {
        return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
      },
      noticeAiDisplay(): string {
        return (this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE] as TesterPageAdapter).noticeAiDisplay.selectedStr;
      },
      noticeType(): number {
        return (this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE] as TesterPageAdapter).noticeAiDisplay.noticeType;
      },
      inParams(): StartupAdapter {
        return this.$store.getters[rootTypes.GETTER_STARTUP];
      },
      faceObject(): FaceAdapter {
        return this.$store.getters[faceType.GETTER_FACE];
      },
      idCardObject(): IdCardAdapter {
        return this.$store.getters[idCardType.GETTER_ID_CARD];
      }
    },
    created() {
      // 初期化 - 「注意書き」顔画像のDefault表示
      this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
        selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_1,
        noticeType: 1
      });
      // 初期化 - サブステータス取得の連携
      this.$nuxt.$once('initAiAuthStatus', (data: { status: number, faceUrl: string, idCardUrl: string }) => {
        this.status = data.status;
        this.faceUrl = data.faceUrl;
        this.idCardUrl = data.idCardUrl;
        this.checkStatusToSetImage(data.status);
      });
      this.$nuxt.$on('identifyNextBtnHandler', (bool: boolean) => {
        this.nextBtnFlg = bool;
      });
    },
    updated() {
      this.$nextTick(function() {
        // 本人認証O
        if (this.inParams.isAuth === 1) {
          if (this.testerPage.fixedStrAiIdentifyList[3].check && this.testerPage.fixedStrAiIdentifyList[7].check) {
            this.repeatToSetfixedStrDisplayCheck([{ index: 8, bool: true }]);
            this.$nuxt.$emit('identifyNextBtnHandler', true);
          }
          // 本人認証✕監視✕録画◯
        } else if (this.inParams.isAuth === 0
          && this.inParams.isProctor === 0
          && this.inParams.isRecord === 1) {
          // 身分証の認証あり
          if (this.inParams.isAiIdcardRequest === 1) {
            if (this.testerPage.fixedStrAiIdentifyList[3].check && this.testerPage.fixedStrAiIdentifyList[7].check) {
              this.$nuxt.$emit('identifyNextBtnHandler', true);
            }
            // 身分証の認証なし
          } else if (this.testerPage.fixedStrAiIdentifyList[3].check) {
            // カメラをフロントカメラへ戻す
            if(this.isMobile()) {
              this.isFront = true;
              this.syncCamera();
            }
            this.$nuxt.$emit('identifyNextBtnHandler', true);
          }
        }
      });
    },
    methods: {
      isMobile() {
        // @ts-ignore
        return this.$ua.isFromSmartphone() || this.$ua.isFromMobilephone() || this.$ua.isFromTablet()
      },
      allChecksTrueFace() {
        this.repeatToSetfixedStrDisplayCheck([
          { index: 1, bool: true },
          { index: 2, bool: true },
          { index: 3, bool: true }
        ]);
      },
      allChecksFalseFace() {
        this.repeatToSetfixedStrDisplayCheck([
          { index: 1, bool: false },
          { index: 2, bool: false },
          { index: 3, bool: false }
        ]);
      },
      allChecksTrueIdCard() {
        this.repeatToSetfixedStrDisplayCheck([
          { index: 5, bool: true },
          { index: 6, bool: true },
          { index: 7, bool: true }
        ]);
      },
      allChecksFalseIdCard() {
        this.repeatToSetfixedStrDisplayCheck([
          { index: 5, bool: false },
          { index: 6, bool: false },
          { index: 7, bool: false }
        ]);
      },
      repeatToSetfixedStrDisplayCheck(arr: { index: number; bool: boolean }[]) {
        arr.forEach((item) => {
          this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_FIXED_STR_AI_DISPLAY_CHECK, {
            index: item.index,
            bool: item.bool
          });
        });
      },
      async registerIdentificationImage() {
        this.disabled = true;

        if(confirm(this.displayLang.AI_IDENTIFICATION_REGISTRATION_ALERT)) {
          const request: FaceRequestType = {
            image: this.image.split(',')[1],
            content_type: 'image/jpeg'
          };
          let data;
          try {
            if (this.status !== 1) {
              this.repeatToSetfixedStrDisplayCheck([{ index: 2, bool: true }]);
              data = await this.$store.dispatch(faceType.ACTION_REQUEST_POST_FACE, request);
              // TODO : 重複と助長になりそうなので、コード整理は後々必要 (FAST LOGIC IMPLEMENTATION!!!!!!)
              // status         ０：顔と身分証がNG１：顔がOK２：身分証がOK ３：顔と身分証OK
              // face_retry     顔画像送s信APIリトライ数
              // id_card_retry  身分証画像送信APIリトライ数
              // messages       {"code":返却コード, "message":"メッセージ"}

              //
              this.status = data.status;
              this.faceUrl = data.faceUrl;
              if (this.checkStatusToSetImage(data.status)) {
                this.completedImageValidation();
              }
            } else {
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_4,
                noticeType: 2
              });
              this.repeatToSetfixedStrDisplayCheck([{ index: 6, bool: true }]);
              data = await this.$store.dispatch(idCardType.ACTION_REQUEST_POST_ID_CARD, request);
              this.status = data.status;
              this.idCardUrl = data.idCardUrl;
              if (this.checkStatusToSetImage(data.status)) {
                this.completedImageValidation();
              }
            }
          } catch (error) {
            console.error(error);
          } finally {
            this.image = '';
            this.takeBtnChange = false;
            this.acceptImage('');
            this.disabled = false;
          }
        } else {
          this.disabled = false;
        }
      },
      completedImageValidation() {
        console.log('ok!!!!!!!!');
      },
      // 初期設定で撮影ボタンを非活性化させる処理
      isFirstCheck() {
        const faceRetryNumber = this.faceObject.faceRetry;
        const idCardRetryNumber = this.idCardObject.idCardRetry;
        const countRetryNum = this.testerPage.countRetryNum;

        if (this.status === 0 && faceRetryNumber === 0 && idCardRetryNumber === 0 && countRetryNum === 0) {
          // 表示＋非活性化 → 表示＋活性化
          this.isDefault = true; 
          return true;
        } else {
          // 表示＋活性化
          this.isDefault = false;
          return true;
        }    
      },
      // フラグが動的に変更するので、function で反映させる目的。
      canClick(){
        return this.isDisabled
      },
      enable(){
        console.log("待機時間")
        this.isDisabled = false;
        console.log("待機時間: done")
      },
      noticesStatusToSetDisplay(status: number) {
        const limitNumberOfFace = this.inParams.aiFaceRetry;
        const limitNumberOfIdCard = this.inParams.aiIdcardRetry;
        const limitAllNumber = this.inParams.aiAllRetry;

        const faceRetryNumber = this.faceObject.faceRetry;
        const idCardRetryNumber = this.idCardObject.idCardRetry;
        const countRetryNum = this.testerPage.countRetryNum;
        const isAiFaildManual = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_SUBSTR_3;

        let errorStr;
        if (this.inParams.isAiFaildManual === 1) {
          // isAiFaildManual = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_SUBSTR_1;
          errorStr = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_6;
        } else if (this.inParams.isAiFaildManual === 2) {
          // isAiFaildManual = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_SUBSTR_2;
          errorStr = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_5;
        } else {
          errorStr = this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_7;
        }
        // 既定値を超えたためエラーメッセージ
        // TODO : retryの表示仕様は固まってないので、今後も変更あり
        if ((faceRetryNumber >= limitNumberOfFace && (status===0 || status===2)) ||
          (faceRetryNumber > limitNumberOfFace && status === 1) ||
          (idCardRetryNumber >= limitNumberOfIdCard && status < 2) ||
          (idCardRetryNumber > limitNumberOfIdCard && status === 2) ||
          (countRetryNum >= limitAllNumber && status !== 3)) {
          this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
            selectedStr: errorStr,
            noticeType: 2,
            limite: limitAllNumber
          });
          this.takeBtnFlag = false;

          // 回数を超えたエラーの場合、とりあえずカメラをフロントカメラへ戻す
          if(this.isMobile()) {
            this.isFront = true;
            this.syncCamera();
          }
          return;
        }

        switch (status) {
          // 顔X, 身分証X
          case 0:
            // 「身分証の認証なし」の場合
            if(countRetryNum > 0) {
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_4,
                noticeType: 2,
                retry: faceRetryNumber,
                limite: limitNumberOfFace,
                failStr: isAiFaildManual
              });
            } else {
              if (faceRetryNumber > 0) {
                this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                  selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_2,
                  noticeType: 2,
                  retry: faceRetryNumber,
                  limite: limitNumberOfFace,
                  failStr: isAiFaildManual
                });
              } else {
                this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                  selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_1,
                  noticeType: 1,
                  retry: faceRetryNumber,
                  limite: limitNumberOfFace
                });
              }
            }
            break;
          case 1:
            // 顔O, 身分証X
            // 「身分証の認証なし」の場合は、ここで終わり。
            if (this.inParams.isAuth === 0
              && this.inParams.isProctor === 0
              && this.inParams.isRecord === 1
              && this.inParams.isAiIdcardRequest === 0) {
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_3,
                noticeType: 1,
                retry: faceRetryNumber,
                limite: limitNumberOfFace
              });
              break;
            }
            if (idCardRetryNumber > 0 || countRetryNum > 0) {
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_3,
                noticeType: 2,
                retry: idCardRetryNumber,
                limite: limitNumberOfIdCard,
                failStr: isAiFaildManual
              });

            } else {
              // 「顔」success, and then「身分証」へ進む。
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
                selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_2,
                noticeType: 1
              });
            }
            break;
          // 顔X, 身分証O
          case 2:
            /*
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
              selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_2,
              noticeType: 2,
              retry: faceRetryNumber,
              limite: limitNumberOfFace
            });
             */
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
              selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_4,
              noticeType: 2,
              retry: faceRetryNumber,
              limite: limitNumberOfFace
            });
            break;
          // 顔O, 身分証O
          case 3:
            // TODO 全パターン成功ステータス。の表示有無
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
              selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_3,
              noticeType: 1,
              retry: faceRetryNumber,
              limite: limitNumberOfFace
            });
            break;
        }
      },
      checkStatusToSetImage(status: number): boolean {
        // モバイルの場合、カメラを切り替える
        if(this.isMobile()) {
          if (status === 1 && this.isFront) {
            this.isFront = false;
            this.syncCamera();
          } else if(status !== 1 && !this.isFront) {
            this.isFront = true;
            this.syncCamera();
          }
        }

        this.noticesStatusToSetDisplay(status);
        let result = false;
        switch (status) {
          // 顔X, 身分証X
          case 0:
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_IDENTITYIMAGE, '');
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_ID_IMAGE, '');

            if (this.inParams.isAuth === 0
              && this.inParams.isProctor === 0
              && this.inParams.isRecord === 1
              && this.inParams.isAiIdcardRequest === 0) {
              this.allChecksFalseFace();
            } else {
              this.repeatToSetfixedStrDisplayCheck([{ index: 4, bool: false }]);
              this.allChecksFalseFace();
              this.allChecksFalseIdCard();
            }
            break;
          case 1:
            // 顔O, 身分証X
            this.allChecksTrueFace();
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_IDENTITYIMAGE, this.faceUrl);
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_ID_IMAGE, '');

            if (this.inParams.isAuth !== 0
              || this.inParams.isProctor !== 0
              || this.inParams.isRecord !== 1
              || this.inParams.isAiIdcardRequest !== 0) {
              this.repeatToSetfixedStrDisplayCheck([{ index: 4, bool: true }]);
              this.allChecksFalseIdCard();
            }
            break;
          // 顔X, 身分証O
          case 2:
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_ID_IMAGE, this.idCardUrl);
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_IDENTITYIMAGE, '');
            this.allChecksFalseFace();
            this.repeatToSetfixedStrDisplayCheck([{ index: 4, bool: true }]);
            this.allChecksTrueIdCard();
            break;
          // 顔O, 身分証O
          case 3:
            result = true;
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_IDENTITYIMAGE, this.faceUrl);
            this.allChecksTrueFace();

            if (this.inParams.isAuth !== 0
              || this.inParams.isProctor !== 0
              || this.inParams.isRecord !== 1
              || this.inParams.isAiIdcardRequest !== 0) {
              this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_ID_IMAGE, this.idCardUrl);
              this.repeatToSetfixedStrDisplayCheck([{ index: 4, bool: true }]);
              this.allChecksTrueIdCard();
            }
            this.$forceUpdate();
            break;
        }
        return result;
      },
      takeIdentificationImage(event: Event) {
        this.takeBtnChange = true;

        if(this.status === 1) {
          this.repeatToSetfixedStrDisplayCheck([{ index: 5, bool: true }]);
          this.image = this.snapshotImage(1);
        } else {
          this.repeatToSetfixedStrDisplayCheck([{ index: 1, bool: true }]);
          this.image = this.snapshotImage(0);
        }
        this.acceptImage(this.image);
      },
      retakeIdentificationImage(event: Event) {
        this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_NOTICE_AI_DISPLAY, {
          selectedStr: this.displayLang.AI_IDENTIFICATION_FIXED_NOTE_ERROR_1,
          noticeType: 2
        });

        if (this.status === 1) {
          this.repeatToSetfixedStrDisplayCheck([{ index: 5, bool: false }]);
        } else {
          this.repeatToSetfixedStrDisplayCheck([{ index: 1, bool: false }]);
        }
        this.takeBtnChange = false;
        this.acceptImage('');
      },
      syncCamera() {
        try {
          (
            this.isFront
              ? this.$mediaDevices.createFrontCameraMediaStream(true, true)
              : this.$mediaDevices.createRearCameraMediaStream(true, true)
          )
            .then((value: MediaStreamResultType) => {
            })
            .catch(err => {
              console.error(err);
            });
        } catch (e)  {
          console.error(e);
        }
      }
    }
  });
</script>
