<template>
  <div class="container">
    <div class="mt-5 mb-5">
      <div class="card">
        <div class="card-header text-center header-normal">
          <i class="fa fa-ban" aria-hidden="true"></i> 監視情報
        </div>
        <div class="card-body">
          <div class="alert-message text-center">
            <span class="alert-icon"
              ><i class="fa fa-window-close" aria-hidden="true"></i
            ></span>
            <span class="alert-text">{{ alertText }}</span>
          </div>
        </div>
        <div v-if="isDisplayReload" class="card">
          <div class="card-body">
            <span>
              <button type="button" class="btn btn-lg btn-primary btn-block" @click="click">リロード</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';

export default Vue.extend({
  middleware: [
    // 'guardActorPage',
  ],
  data() {
    return {
      alertText: '' as string
    };
  },
  computed: {
    isDisplayReload() {
      // TODO:現在は本番環境はF5が押された場合「400」画面がでるのでこのif文に入ることはない 本番環境では動かないコードなので、コメントアウトしておく
      // スタートアップが完了しているか？
      //const isStartupped = this.$store.getters[rootTypes.GETTER_IS_STARTUPPED];
      //if (!isStartupped) {
      //  // スタートアップが完了していない場合とは、
      //  // ローカルストレージがブロックされていて、F5が押された時の状態
      //  // この時、「リロード」ボタンを押下するとnuxtのエラー画面が表示されるので、
      //  // 表示されないようにする
      //  return false
      //}

      switch (this.$route.params.id) {
        case 'popup-block':
        case 'notification-block':
        case 'storage-block':
          return true

        default:
          return false
      }
    },
  },
  created() {
    // TODO:現在は本番環境はF5が押された場合「400」画面がでるのでこのif文に入ることはない 本番環境では動かないコードなので、コメントアウトしておく
    // スタートアップが完了しているか？
    //const isStartupped = this.$store.getters[rootTypes.GETTER_IS_STARTUPPED];
    //const reloadMessage = isStartupped
    //  ? '解除したのち、リロードボタンを押下してください。'
    //  : ''
    const reloadMessage = '解除したのち、リロードボタンを押下してください。'

    switch (this.$route.params.id) {
      case 'popup-block':
        this.alertText = 'ポップアップブロックが設定されています。' + reloadMessage;
        break;

      case 'notification-block':
        this.alertText = '通知ブロックが設定されています。' + reloadMessage;
        break;

      case 'storage-block':
        this.alertText = 'ローカルストレージの使用がブロックされています。' + reloadMessage;
        break;

      case 'excluded-os':
        this.alertText = 'OSがサポートされていません。';
        break;

      case 'excluded-os-version':
        this.alertText = 'OSのバージョンがサポートされていません。';
        break;

      case 'excluded-browser':
        this.alertText = 'ブラウザがサポートされていません。';
        break;

      case 'excluded-browser-version':
        this.alertText = 'ブラウザのバージョンがサポートされていません。';
        break;

      case 'kicked':
        this.alertText = 'ログインが禁止されています。';
        break;

      default:
        this.alertText = 'ブラウザを閉じてください。';
    }
  },
  methods: {
    click() {
      this.$window.reload(LogoutMethod.NONE); // 画面復帰するために、スタートアップURLでリロードします
    },
  },
  head() {
    return {
      title: 'Remote Testing'
    };
  }
});
</script>

<style scoped></style>
