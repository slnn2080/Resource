<template>
  <ul class="list-group setting-check">
    <EnvSettingCameraChecker />
    <EnvSettingMicrophoneChecker />
  </ul>
</template>
<script lang="ts">
import Vue from 'vue';
import EnvSettingCameraChecker from './EnvSettingCheckerChilds/EnvSettingCameraChecker.vue';
import EnvSettingMicrophoneChecker from './EnvSettingCheckerChilds/EnvSettingMicrophoneChecker.vue';
export default Vue.extend({
  name: 'EnvSettingTerm',
  components: {
    EnvSettingCameraChecker,
    EnvSettingMicrophoneChecker
  }
});
</script>
