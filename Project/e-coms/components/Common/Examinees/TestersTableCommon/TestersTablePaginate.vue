<template>
  <div
    v-if="pageCount > 0"
    class="text-right"
    :class="{'col-6': isTop}"
  >
    <nav class="d-inline-block">
      <Paginate
        :first-last-button="true"
        :first-button-text="firstButtonText"
        :last-button-text="lastButtonText"
        :click-handler="clickHandler"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item page-item-hide'"
        :prev-link-class="'page-link'"
        :next-class="'page-item page-item-hide'"
        :next-link-class="'page-link'"
        :break-view-class="'page-item disabled'"
        :break-view-link-class="'page-link'"
        :active-class="'active'"
        :disabled-class="'disabled'"
        :page-range="3"
        :margin-pages="1"
        :page-count="pageCount"
        :force-page="page"
        :value="page"
      >
      </Paginate>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TestersTablePaginate',
  props: {
    isTop: {
      type: Boolean,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  computed: {
    firstButtonText(): string {
      return '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
    },
    lastButtonText(): string {
      return '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    },
  },
  methods: {
    clickHandler(page: number) {
      this.$emit('click-pagination', page)
    }
  },
});
</script>

<style>
/* ページネーションのprev/nextボタンを表示しない */
.page-item-hide {
  display: none;
}
</style>
