<template>
  <div>
    <div class="badge badge-primary">{{ target }}</div>
    <div
      v-if="displayUserName"
      class="user-id d-inline-block"
    >
      {{ displayUserName }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LoginAdapter } from '~/store/types/adapters/loginAdapter';
import { TesterConditions } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';

export default Vue.extend({
  name: 'McExaminingIndex',
  components: {
  },
  props: {
    testerConditions: {
      type: Object as PropType<TesterConditions>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    target(): string | null {
      const target = this.inParams.target;
      const domain = this.extractDomain(target);
      return domain || this.extractDomain(decodeURIComponent(target));
    },
    displayUserName(): string {
      return `${this.loginData.examUserName} (${this.loginData.loginId})`;
    },
  },
  methods: {
    extractDomain(target: string): string | null {
      const match = target.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      if (match == null || match.length < 2) {
        return null;
      } else {
        return match[1];
      }
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
