# RemoteTesting

> RemoteTesting

## ■ Environment Setup (環境準備)

- Node JS - v12.16.3 (https://nodejs.org/ja/)
- Git (latest)
- Visual Studio Code
  - 追加拡張機能
    - Vue
    - Vetur
    - ESLint
    - Prettier

※こだわりはないので、自分好みの拡張機能を入れてもいいです。

### Node JS Dependency/devDependency Modules

```
package.json 参考
```

## ■ 基本 Rule

- 基本的なスタイルガイドは公式サイトのガイドに従う。[Vue Style Guide](https://jp.vuejs.org//v2/style-guide/)

- NuxtJs with TypeScript
  - Vue Object Style. [Options API](https://typescript.nuxtjs.org/ja/cookbook/components/#template)

### Git Commit Rule

- https://chris.beams.io/posts/git-commit/ (英語)
- https://suwaru.tokyo/%E3%80%90%E5%BF%85%E9%A0%88%E3%80%91git%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%E3%83%BB%E4%BD%9C%E6%B3%95%E3%80%90prefix-emoji%E3%80%91/#anc_2 (日本語)

※必ず準じることではないので、ある程度は従いましょう

### Git Pull Request Rule

- buildとlintが通るだけで良いです。

```js
npm run lint // コードに問題中をチェックしてくれます。errorがあると解決してください。(※Warningは解決しなくてもOKです。)

npm run build // 正常にbuildされるかをチェックしてください。

npm run lint --fix // コードを自動FIXしたい場合は使ってください。ある程度修正してくれます。修正されたファイルを必ず差分を確認して問題ないのかをチェックしてください。
```

### ▼ 改行コード

- CRLF

### ▼ Lint Rule

- ベースは、.eslint の記載に準じる

### ▼ Vue Component Template

```js
<template>
  <!-- do something -->
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  // do something
})
</script>
// <style>
// <style scoped>
<style lang="scss" scoped>
  .do_style {}
</style>
```


### ▼ TypeScript Rule

コメントを記載するのは以下の場合です。

- 単体 Function

```ts
/**
 * 関数の説明
 * @param {string} foo - hoge param
 * @param {string} bar - Hoge Objectのparam
 * @return {boolean} 真偽値を返す
 */
function testFunctionhoge(foo: string, bar: Hoge): boolean {
  // do something
  return true;
}
```

- 単体 Class

```ts
/**
 * class説明
 * constructorの説明
 * @constructor
 * @param {number} foo - 説明1
 * @param {string} bar - 説明2
 * @param {number} baz - 説明3
 */
class TesterAdapter {
  constructor(public foo: number, public bar: string, public baz: number) {}
  /**
   * 関数の説明
   * @return {boolean} 真偽値を返す
   */
  getHoge(): boolean {
    return true;
  }
}
```


### ▼ Vue and Nuxt チートシート

- [Vue チートシート](https://www.vuemastery.com/pdf/Vue-Essentials-Cheat-Sheet.pdf)
- [Nuxt チートシート](https://www.vuemastery.com/pdf/Nuxtjs-Cheat-Sheet.pdf)
- [Vuex シートシート](https://vuejs-tips.github.io/vuex-cheatsheet/)

## ■ RemoteTesting Architecture (with Vuex)

全体図概念

![image_1](https://e-coms.backlog.jp/ViewWikiAttachmentImage.action?attachmentId=303318)

### Vuex Store

![image_2](https://e-coms.backlog.jp/ViewWikiAttachmentImage.action?attachmentId=303319)


### plugin

![image_3](https://e-coms.backlog.jp/ViewWikiAttachmentImage.action?attachmentId=303320)

https://ja.nuxtjs.org/guide/plugins/

[WebRTCの簡易シグナリング - qiita](https://qiita.com/massie_g/items/f5baf316652bbc6fcef1)

- kvsConfig.ts : KVSのconfigをセットする plugin
- master.ts : 受験者用のKVS plugin
- viewer.ts : 監視者用のKVS plugin
- mediaDevices.ts : getMediaStreamなどを作成してくれる plugin
- kvsEventBus.ts : KVSのEventListenerにて渡される情報を連携するためのplugin (※主に EventEmitterを利用)
- upload.ts : S3に動画をアップロードする plugin
- axios.ts : XmlHttpRequestのheaderを事前にセットするように実装した plugin

plugin 使用法 チートシート
```ts
// master.ts
interface Vue, Store<S>, NuxtAppOptions {
  $kvsMaster(localStream: MediaStream, eventHandler: any): KVSMaster;
}
// this.$kvsMaster( ... )
// context.app.$kvsMaster( ... )

// viewer.ts
interface Vue, Store<S>, NuxtAppOptions {
  $kvsViewer(eventHandler: any): KVSViewer;
}
// this.$kvsViewer( ... )
// context.app.$kvsViewer( ... )

// mediaDevices.ts
interface Vue, Store<S>, NuxtAppOptions {
  $mediaDevices.getMediaStream(videoFlg: boolean, audioFlg: boolean): Promise<{ isAllow: boolean; isEnableVideo: boolean; isEnableAudio: boolean; mediaStream: MediaStream }>;
}

// this.$mediaDevices.getMediaStream( ... )
// context.app.$mediaDevices.getMediaStream( ... )

interface Vue, Store<S>, NuxtAppOptions {
  $kvsEventBus: Vue;
}
// Vueに関わるものすべて使用可能。
// 特にkvsのEventListenerの値を受け取るために、event emitterを主に利用する
// context.$kvsEventBus.$on( ... )
// context.app.$kvsEventBus.$emit( ... )

```


### MiddleWare

![image_3](https://e-coms.backlog.jp/ViewWikiAttachmentImage.action?attachmentId=303321)

https://ja.nuxtjs.org/api/pages-middleware/

- initCheck.ts : root path( / )のvueファイルがこのファイルを呼ぶようになっている middleWare
  主にやることは、QueryStringで渡された「起動パラメータ」をJS Objectに変換、ポップアップチェックなどなど

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for staging, production and launch server
$ npm run build:stg
$ npm run build:prod
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
