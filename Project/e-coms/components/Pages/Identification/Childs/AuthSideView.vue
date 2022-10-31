<template>
  <div class="auth-side">
    <div class="auth-photo">
      <div class="row no-gutters">

        <IdentityImage>
          <img
            :src="testerPage.identityImage"
            v-if="testerPage.identityImage"
            style="width: 100%; height: auto; text-align: center; position: absolute"
          />
        </IdentityImage>
        <!--
        <div v-if="testerPage.identityImage" class="col-sm-6" style="overflow: hidden">
          <img :src="testerPage.identityImage" class="img-fluid" style="max-height: initial; margin-top: -15%;">
        </div>
        <div v-else class="col-sm-6">
          <div class="auth-photo-frame face-auth no-photo">
            <div class="no-connect-item">
              <div class="no-connect-icon"><i class="fa fa-user" aria-hidden="true"></i></div>
              <div class="no-connect-label">{{ displayLang.AI_IDENTIFICATION_AUTH_IMAGE }}</div>
            </div>
          </div>
        </div>
        -->
        <div v-if="invisibleIDImage()"></div>
        <!--
        <div v-else class="col-sm-6" style="overflow: hidden">
          <img :src="testerPage.idImage" v-if="testerPage.idImage"  class="img-fluid" style="max-height: initial; margin-top: -15%">
          <div v-else class="auth-photo-frame face-auth no-photo">
            <div class="no-connect-item">
              <div class="no-connect-icon"><i class="fa fa-id-card" aria-hidden="true"></i></div>
              <div class="no-connect-label">{{ displayLang.AI_IDENTIFICATION_ID_IMAGE }}</div>
            </div>
          </div>
        </div>
        -->
        <IDImage v-else>
          <img :src="testerPage.idImage"
               v-if="testerPage.idImage && !isAndroid()"
               style="width: 100%; height: auto; text-align: center; position: absolute"
          />
          <img :src="testerPage.idImage"
               v-else-if="testerPage.idImage && isAndroid()"
               style="position: absolute; display: inline-block; width: auto; max-height: 100%; text-align: center;"
          />
        </IDImage>
      </div>
    </div>
    <IdentifyAICheckList :identify-index="identifyIndex" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as rootTypes from '@/store/types/rootType';
  import * as testerPageTypes from '@/store/types/testerPageType';
  import * as testerTypes from '@/store/types/testerType';
  import * as matchingType from '@/store/types/matchingType';
  import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
  import StartupAdapter from '@/store/types/adapters/startupAdapter';
  import { Matching } from '@/store/types/adapters/matchingAdapter';

  import { TesterState } from '~/store/enum/TesterState';
  import { LanguageEnum } from '@/store/enum/language';

  import IdentifyAICheckList from '@/components/Pages/Identification/Childs/IdentifyAICheckList.vue';
  import IdentityImage from '@/components/Pages/Identification/Childs/IdentityImage.vue';
  import IDImage from '@/components/Pages/Identification/Childs/IDImage.vue';

  export default Vue.extend({
    name: 'AuthSideView',
    components: {
      IdentityImage,
      IDImage,
      IdentifyAICheckList
    },
    props: {},
    data() {
      return {
        identifyIndex: 1
      };
    },
    created() {
      if (this.inParams.isAuth === 1) {
        // 本人認証 ◯
        this.identifyIndex = 1;
        // 本人認証✕監視✕録画◯
      } else if (this.inParams.isAuth === 0 && this.inParams.isProctor === 0 && this.inParams.isRecord === 1) {
        // 身分証の認証あり
        if (this.inParams.isAiIdcardRequest === 1) {
          this.identifyIndex = 2;
          // 身分証の認証なし
        } else {
          this.identifyIndex = 3;
        }
      } else {
        console.info('[LOG INFO]「起動パラメータ」に該当する値がないため、default 1を設定します。');
        this.identifyIndex = 1;
      }
    },
    computed: {
      testerPage(): TesterPageAdapter {
        return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
      },
      inParams(): StartupAdapter {
        return this.$store.getters[rootTypes.GETTER_STARTUP];
      },
      displayLang(): LanguageEnum {
        return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
      }
    },
    methods: {
      isAndroid() {
        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if(/Android/i.test(navigator.userAgent)) {
          return true
        } else {
          return false
        }
      },
      invisibleIDImage() {
        return (
          this.inParams.isAuth === 0 &&
          this.inParams.isProctor === 0 &&
          this.inParams.isRecord === 1 &&
          this.inParams.isAiIdcardRequest === 0
        );
      }
    }
  });
</script>
