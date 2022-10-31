<template>
  <div class="form-inline">
    <select
      id="testing_organization"
      class="form-control mr-1"
      v-model="actorKind"
    >
      <option
        v-for="option in actorKindOptions"
        :value="option.value"
      >{{ option.label }}</option>
    </select>
    <button
      type="button"
      class="btn btn-primary"
      @click.prevent="onClickSubmit"
    >{{ displayLang.LOGINS_FORM_SUBMIT_LABEL }}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as loginsPageTypes from '@/store/types/loginsPageType';
import { ActorKind } from '@/store/types/adapters/loginsAdapter';

export default Vue.extend({
  name: 'Form',
  components: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    actorKindOptions(): {value: number, label: string}[] {
      return [
        {value: ActorKind.TESTER, label: (this.displayLang as any).LOGINS_FORM_ACTOR_KIND_TESTER},
        {value: ActorKind.OTHER,  label: (this.displayLang as any).LOGINS_FORM_ACTOR_KIND_OTHER},
        {value: ActorKind.ALL,    label: (this.displayLang as any).LOGINS_FORM_ACTOR_KIND_ALL},
      ]
    },
    actorKind: {
      get(): number {
        return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES_ACTOR_KIND]
      },
      set(value: number) {
        this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_ACTOR_KIND, value)
      }
    },
  },
  methods: {
    /**
     * 「検索」ボタンのイベントハンドラ
     */
    onClickSubmit() {
      // ページ数を設定 ページ数を初期化するのは、変更後のページ数が変更前よりも小さい場合、エラーが発生するため
      this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_PAGE, 1)
        .then(() => this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_CALL_API_GET_LOGINS))
    },
  },
});
</script>

<style></style>

