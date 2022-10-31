import { Plugin, Context } from '@nuxt/types';
import Vue from 'vue';
import {LanguageEnum} from "@/store/enum/language";
import * as rootTypes from "@/store/types/rootType";

declare module 'vue/types/vue' {
  interface Vue {
    $modals: Modals;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $modals: Modals;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $modals: Modals;
  }
}

export enum ModalType {
  SUCCESS = 'success',
  ERROR   = 'error',
  CAUTION   = 'caution',
}

export type ModalOptions = {
  modalType?: ModalType;
  title?: string;
  body?: string | string[];
  hideBackdrop?: boolean;
}
const defaultModalOptions: ModalOptions = {
  modalType: ModalType.SUCCESS,
  title: '',
  body: '',
  hideBackdrop: false,
}

export type AlertModalEvent = {
}
export type ConfirmModalEvent = {
  ok: boolean;
}

class Modals
{
  public constructor(
    public eventBus: Vue,
    public context: Context,
  ) {}

  /**
   * アラートモーダルを表示します
   *
   * @param {ModalOptions} options
   * @param {Promise<boolean>}
   */
  private showAlert(options: ModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.eventBus.$on('global-alert-modal-hidden', (event: AlertModalEvent) => {
        this.eventBus.$off('global-alert-modal-hidden')
        resolve()
      })
      this.eventBus.$emit('global-alert-modal-show', options)
    })
  }

  /**
   * アラートモーダルを表示します
   *
   * @param {string | string[]} body
   * @param {ModalOptions?} options
   * @param {Promise<boolean>}
   */
  public showSuccessAlert(body: string | string[], options?: ModalOptions): Promise<boolean> {
    return this.showAlert(
      Object.assign(
        {},
        defaultModalOptions,
        {
          modalType: ModalType.SUCCESS,
          title: (this.displayLang as any).MODAL_SUCCESS_TITLE_DEFAULT,
          body: body,
        },
        options || {}
      )
    )
  }

  /**
   * アラートモーダルを表示します
   *
   * @param {string | string[]} body
   * @param {ModalOptions?} options
   * @param {Promise<boolean>}
   */
  public showCautionAlert(body: string | string[], options?: ModalOptions): Promise<boolean> {
    return this.showAlert(
      Object.assign(
        {},
        defaultModalOptions,
        {
          modalType: ModalType.CAUTION,
          title: (this.displayLang as any).MODAL_CAUTION_TITLE_DEFAULT,
          body: body,
        },
        options || {}
      )
    )
  }

  /**
   * アラートモーダルを表示します
   *
   * @param {string | string[]} body
   * @param {ModalOptions?} options
   * @param {Promise<boolean>}
   */
  public showErrorAlert(body: string | string[], options?: ModalOptions): Promise<boolean> {
    return this.showAlert(
      Object.assign(
        {},
        defaultModalOptions,
        {
          modalType: ModalType.ERROR,
          title: (this.displayLang as any).MODAL_ERROR_TITLE_DEFAULT,
          body: body,
        },
        options || {}
      )
    )
  }

  /**
   * 確認モーダルを表示します
   *
   * @param {ModalOptions} options
   * @param {Promise<boolean>}
   */
  private showConfirm(options: ModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.eventBus.$on('global-confirm-modal-hidden', (event: ConfirmModalEvent) => {
        this.eventBus.$off('global-confirm-modal-hidden')
        resolve(event.ok)
      })
      this.eventBus.$emit('global-confirm-modal-show', options)
    })
  }

  /**
   * 確認モーダルを表示します
   *
   * @param {string | string[]} body
   * @param {ModalOptions?} options
   * @param {Promise<boolean>}
   */
  public showSuccessConfirm(body: string | string[], options?: ModalOptions): Promise<boolean> {
    return this.showConfirm(
      Object.assign(
        {},
        defaultModalOptions,
        {
          modalType: ModalType.SUCCESS,
          title: (this.displayLang as any).MODAL_CONFIRM_TITLE_DEFAULT,
          body: body,
        },
        options || {}
      )
    )
  }

  /**
   * 確認モーダルを表示します
   *
   * @param {string | string[]} body
   * @param {ModalOptions?} options
   * @param {Promise<boolean>}
   */
  public showErrorConfirm(body: string | string[], options?: ModalOptions): Promise<boolean> {
    return this.showConfirm(
      Object.assign(
        {},
        defaultModalOptions,
        {
          modalType: ModalType.ERROR,
          title: (this.displayLang as any).MODAL_CONFIRM_TITLE_DEFAULT,
          body: body,
        },
        options || {}
      )
    )
  }

  private get displayLang(): LanguageEnum {
    return this.context.store.getters[rootTypes.GETTER_DISPLAY_LANG];
  }
}

const plugin: Plugin = (context: Context, inject) => {
  inject('modals', new Modals(new Vue(), context));
};
export default plugin
