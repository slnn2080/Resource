<template>
  <div>
    <main class="main">
      <div class="container">
        <CreateShorturl :value="updateUrl" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateShorturl from "@/components/Pages/CreateShorturl/CreateShorturl.vue";
import * as createShortUrlPageTypes from "@/store/types/createShortUrlPageType";

export default Vue.extend({
  components: {
    CreateShorturl,
  },
  head() {
    return {
      title: "URL登録 / Remote Testing",
    };
  },
  computed: {
    updateUrl() {
      const updateValues = this.$store.getters[
        createShortUrlPageTypes.GETTER_SELECT_SHORTEN_URL_LIST
      ];
      let updateValue = {};
      for (let v in updateValues) {
        const item = updateValues[v];
        if (this.$route.params.id == item.id) {
          updateValue = item;
          break;
        }
      }
      // @ts-ignore 暫定対応
      if (updateValue.param) {
        // @ts-ignore
        updateValue.param = JSON.parse(updateValue.param);
      }
      return updateValue;
    },
  },
});
</script>

<style></style>
