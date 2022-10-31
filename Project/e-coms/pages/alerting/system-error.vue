<template>
  <div class="container">
    <div class="mt-5 mb-5">
      <div class="card system-error">
        <div class="card-header text-center header-normal" style="background-color: #F42F2F">
		  <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> システムエラー
		</div>
		<div class="card-body">
		  <div class="alert-message text-center">
		    <span class="alert-text">{{ displayLang.INTERNAL_SERVER_ERROR_ALERT_TEXT }}</span>
		  </div>
		</div>
	  </div>
	</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as pageTypes from '@/store/types/testerPageType';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '~/store/enum/language';
export default Vue.extend({
  middleware: [
    // 'guardActorPage',
  ],
  
  head() {
    return {
      title: 'Remote Testing'
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  }
});
</script>

<style scoped></style>
