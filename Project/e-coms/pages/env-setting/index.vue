<template>
  <div>
    <EnvSetting />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EnvSetting from '@/components/Pages/EnvSetting/EnvSetting.vue';
export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    EnvSetting
  },
  head() {
    return {
      title: '環境設定'
    };
  }
});
</script>

<style scoped></style>
