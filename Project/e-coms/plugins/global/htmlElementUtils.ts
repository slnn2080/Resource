import { Plugin, Context } from '@nuxt/types';
import Vue from 'vue';
import {LanguageEnum} from "@/store/enum/language";

declare module 'vue/types/vue' {
  interface Vue {
    $htmlElementUtils: HTMLElementUtils;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $htmlElementUtils: HTMLElementUtils;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $htmlElementUtils: HTMLElementUtils;
  }
}

let context: Context|null = null
const URL = (window.webkitURL || window.URL) as any

export class HTMLVideoElementUtils {
  public constructor() {}

  /**
   * Video要素を生成します
   *
   * @return {HTMLVideoElement}
   */
  public create() {
    const videoTag = document.createElement('video');
    videoTag.autoplay = true;
    (videoTag as any).playsinline = true;
    videoTag.muted = true;
    videoTag.style.width = '100%';
    videoTag.style.height = '100%';

    return videoTag
  }

  /**
   * src/srcObject属性を設定します
   *
   * @param {HTMLVideoElement} videoElement
   * @param {MediaStream | Blob | File | null} src
   * @return {Promise<HTMLVideoElement>}
   */
  public setSrcObject(
    videoElement : HTMLVideoElement,
    src: MediaStream | Blob | File | null
  ): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      let oldSrc

      // video要素のsrc属性に値が設定されていた場合後始末を行う/srcObjectの場合はnullを設定すればいいので、後始末は特に考慮しない
      videoElement.srcObject = null
      if (videoElement.src) {
        oldSrc = videoElement.src
        videoElement.src = ''
        if (oldSrc) {
          // @ts-ignore
          if (context.$ua.isFromAndroidOs() && (context.$ua.browser() === 'Chrome')) {
            // nop
          } else {
            URL.revokeObjectURL(oldSrc);
          }
          oldSrc = '';
        }
      }
      try {
        if (!('srcObject' in videoElement)) {
          throw new Error()
        }
        if (src instanceof Blob) {
          throw new Error()
        }
        if (src instanceof File) {
          throw new Error()
        }

        // srcがMediaStreamの場合は問題ないが、Blobの場合ブラウザが未サポートのため、catch()ブロックに制御を流す
        // https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/srcObject
        videoElement.srcObject = src
        resolve(videoElement)
      } catch (e) {
        if (
          (src instanceof Blob) &&
          // @ts-ignore
          (context.$ua.isFromAndroidOs() && (context.$ua.browser() === 'Chrome'))
        ) {
          const reader = new FileReader();
          reader.onload = (event) => {
            videoElement.src = reader.result as string
            resolve(videoElement);
          };
          reader.onerror = (event) => {
            videoElement.src = ''
            resolve(videoElement);
          };
          reader.readAsDataURL(src);
        } else {
          videoElement.src = (src ? URL.createObjectURL(src) : '')
          resolve(videoElement)
        }
      }
    })
  }
};

export type HTMLElementUtils = {
  videoElement: HTMLVideoElementUtils;
}

export const htmlElementUtils: HTMLElementUtils = {
  videoElement: new HTMLVideoElementUtils()
}


const plugin: Plugin = (ctx: Context, inject) => {
  context = ctx
  inject('htmlElementUtils', htmlElementUtils)
};
export default plugin
