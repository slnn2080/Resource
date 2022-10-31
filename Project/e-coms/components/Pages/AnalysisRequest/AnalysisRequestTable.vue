<template>
  <div>
    <template v-if="analysisRequests && analysisRequests.length">
      <table class="table table-bordered table-striped user-list sticky-ai-proctor">
        <thead>
          <tr>
            <Header
              :label="''"
              :sort-key="1"
              :add-class="'seq'"
            />
            <Header
              :label="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_TABLE_HEADER_INSEQ"
              :sort-key="2"
              :add-class="''"
            />
            <Header
              :label="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_TABLE_HEADER_STATUS"
              :sort-key="3"
              :add-class="''"
            />
            <Header
              :label="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_TABLE_HEADER_ENV"
              :sort-key="4"
              :add-class="''"
            />
            <Header
              :label="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_TABLE_HEADER_CREATED_AT"
              :sort-key="6"
              :add-class="''"
            />
            <Header
              :label="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_TABLE_HEADER_UPDATED_AT"
              :sort-key="7"
              :add-class="''"
            />
          </tr>
        </thead>
        <tbody>
          <template v-for="(analysisRequest, index) in analysisRequests">
            <tr>
            <td class="seq">{{ analysisRequest.id }}</td>
            <td class="text-right">{{ analysisRequest.inseq }}</td>
            <td>{{ analysisRequest.status }}</td>
            <td>{{ analysisRequest.env }}</td>
            <td>{{ analysisRequest.createdAt }}</td>
            <td>{{ analysisRequest.updatedAt }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
    <template v-else>
      <div class="alert alert-success search-result"><i aria-hidden="true" class="fa fa-exclamation-circle"></i>現在AI解析情報は存在しません</div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './AnalysisRequestTableChilds/Header.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/analysisRequestPageType';
import {
  AnalysisRequest,
} from '@/store/types/adapters/analysisRequestIndexApiAdapter.ts';

export default Vue.extend({
  name: 'AnalysisRequestTable',
  components: {
    Header,
  },
  data() {
    return {
      timeInterval: null as (NodeJS.Timeout | null),
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    analysisRequests(): AnalysisRequest[] {
      return this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES].analysisRequests;
    },
  },
  created() {
    const func = () => {
      this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_INDEX);
    };

    func();
    this.timeInterval = setInterval(() => {
      func();
    }, 1000);
  },
  destroyed() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null
    }

    this.$destroy();
  },
});
</script>

<style></style>

