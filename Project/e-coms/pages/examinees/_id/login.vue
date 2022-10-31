<template>
  <main class="main">
    <div class="container">
      <div class="mt-4 mb-4">
        <div class="card">
          <div class="card-body">
            <ExamineesLogin />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import ExamineesLogin from '@/components/Pages/Examinees/Login/ExamineesLogin.vue';
export default Vue.extend({
  name: 'Login',
  components: {
    ExamineesLogin
  }
});
</script>

<style scoped></style>
