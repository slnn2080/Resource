<template>
  <main class="main">
    <div class="container">
      <div class="mt-5 mb-5">
        <div class="card">
          <div class="card-header text-center header-normal">
            <i class="fa fa-ban" aria-hidden="true"></i>
            {{ displayLang.EXAM_END_TERM }}
          </div>
          <div class="card-body">
            <div class="alert-message text-center">
              <span class="alert-text">{{ displayLang.EXAMINING_CLOSE }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import { pushMessage } from '@/static/push';
import { MessageObject } from '@/plugins/kvs/type/sendMessageType';

export default Vue.extend({
  middleware: [
    'guardActorPage'
  ],
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  },
});
</script>

<style scoped></style>
