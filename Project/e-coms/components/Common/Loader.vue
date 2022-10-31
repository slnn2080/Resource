<template>
  <div v-if="isLoading" class="loader">
    <template v-if="isLoadingAlertVisible">
      <div class="loader-alert">
        <div
          v-if="isUploadingAlertVisible"
          class="alert alert-danger"
          role="alert"
        >
          {{ displayLang.LOADING_ALERT_UPLOADING }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';

export default Vue.extend({
  name: 'Loader',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    isLoading(): boolean {
      return this.$store.getters[commonTypes.GETTER_COMMON_IS_LOADING]
    },
    isLoadingAlertVisible(): boolean {
      return this.$store.getters[commonTypes.GETTER_COMMON_IS_LOADING_ALERT_VISIBLE]
    },
    isUploadingAlertVisible(): boolean {
      return this.$store.getters[commonTypes.GETTER_COMMON_IS_UPLOADING_ALERT_VISIBLE]
    },
  }
});
</script>

<style scoped lang="scss">

.loader-alert {
  position: relative;
  top: calc(50% + 64px);
  width: 100%;

  .alert {
    width: 320px;
    margin: 0 auto;
    @media screen and (max-width: 320px){
      width: 100%;
    }
  }
}

</style>
