<template>
  <div>
    <div v-if="testerConditions.isDisconnect" class="alert alert-warning header-alert-fix">
      {{ displayLang.IDENTIFICATION_DISCONNECT_NETWORK }}
    </div>

    <div class="main">
      <div class="container">
        <div class="mt-5 mb-5">
          <div class="card">
            <div>
              <div class="card-header text-center header-notes">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                {{ displayLang.EXAMINING_TERM }}
              </div>
              <div class="card-body">
                <p class="exp-text">
                  {{ displayLang.EXAMINING_TERM_EXP_TEXT }}
                </p>
                <div class="card mb-3">
                  <div ref="scroll" class="card-body terms-text white-space:pre-wrap; word-wrap:break-word;" @scroll="onScroll">
                    <div>
                      {{  displayLang.EXAMINING_TERM_NOTE_HEADER }}
                    </div>
                    <div
                      v-for="(note, index) of displayLang.EXAMINING_TERM_NOTES.split('\n').filter(v => v.trim().length > 0)"
                      :key="index"
                    >
                      ・{{ note }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="!testerConditions.isExaming"
                  class="custom-control custom-checkbox terms-check mb-4"
                >
                  <input
                    id="termscheck"
                    value="testerPage.isExamTermAgree"
                    type="checkbox"
                    class="custom-control-input"
                    :disabled="!termRead"
                    @change="onChangeAgree"
                  />
                  <label class="custom-control-label" for="termscheck">{{
                    displayLang.EXAMINING_TERM_AGREE
                  }}</label>
                </div>
              </div>
            </div>

            <div class="card-footer text-center">
              <button
                v-if="testerConditions.isBeforeExam"
                type="button"
                class="btn btn-primary"
                :disabled="!testerPage.isExamTermAgree"
                @click.once="$emit('agree')"
              >
                {{ displayLang.EXAMINING_LOGIN_TEST_SYSTEM }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import { TesterConditions } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';

export default Vue.extend({
  name: 'AgreementIndex',
  components: {
  },
  props: {
    testerConditions: {
      type: Object as PropType<TesterConditions>,
      required: true,
    },
  },
  data() {
    return {
      termRead: false as boolean,
    } as any
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
  },
  mounted() {
    this.onScroll();
  },
  methods: {
    /**
     * 「受験利用規約同意」のスクロールポジション監視のイベントハンドラ
     */
    onScroll() {
      const target = this.$refs['scroll'] as HTMLDivElement;
      if (target) {
        if (Math.ceil(target.scrollTop) >= (target.scrollHeight - target.clientHeight) && !this.termRead) {
          this.termRead = true;
        }
      }
    },
    /**
     * 「同意」チェックボックスのイベントハンドラ
     */
    onChangeAgree(event: Event) {
      const target = event.currentTarget as HTMLInputElement;
      if (target) {
        this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_EXAM_TERM_AGREE, target.checked)
      }
    },
  },
});
</script>
