<template>
  <ValidationObserver
    ref="accessLimitInsertForm"
    v-slot="{ dirty, invalid }"
    slim
  >
    <div>
      <div class="card-body">
        <div class="form-row">
          <ValidationProvider
            ref="serverInput"
            v-slot="{ errors, dirty, invalid }"
            :name="displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_SERVER"
            rules="required"
            slim
          >
            <div class="form-group col-4">
              <label for="auth_server">
                {{ displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_SERVER }}
              </label>
              <input
                id="auth_server"
                v-model="server"
                type="text"
                class="form-control"
                :class="[(dirty && invalid) ? 'is-invalid' : '']"
              >
              <template v-if="dirty && invalid">
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </template>
            </div>
          </ValidationProvider>
        </div>
        <div class="form-row">
          <ValidationProvider
            ref="ipInput"
            v-slot="{ errors, dirty, invalid }"
            :name="displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_IP"
            vid="ip"
            rules="ip|required_ip_or_domain:ip,domain"
            slim
          >
            <div class="form-group col-4">
              <label for="ip_address">
                {{ displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_IP }}
              </label>
              <input
                id="ip_address"
                v-model="ip"
                type="text"
                class="form-control"
                :class="[(dirty && invalid) ? 'is-invalid' : '']"
              >
              <template v-if="dirty && invalid">
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </template>
            </div>
          </ValidationProvider>
          <ValidationProvider
            ref="domainInput"
            v-slot="{ errors, dirty, invalid }"
            :name="displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_DOMAIN"
            vid="domain"
            rules="required_ip_or_domain:ip,domain"
            slim
          >
            <div class="form-group col-4">
              <label for="domain">
                {{ displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_DOMAIN }}
              </label>
              <input
                id="domain"
                v-model="domain"
                type="text"
                class="form-control"
                :class="[(dirty && invalid) ? 'is-invalid' : '']"
              >
              <template v-if="dirty && invalid">
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </template>
            </div>
          </ValidationProvider>
        </div>
        <div class="form-row">
          <ValidationProvider
            ref="actorInput"
            v-slot="{ errors, dirty, invalid }"
            :name="displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_ACTOR"
            rules="required"
            slim
          >
            <div class="form-group col-4">
              <label for="target_actor">
                {{ displayLang.ACCESS_LIMIT_TABLE_FORM_LABEL_ACTOR }}
              </label>
              <select
                id="target_actor"
                v-model="actor"
                class="form-control"
                :class="[(dirty && invalid) ? 'is-invalid' : '']"
              >
                <option :value="null" selected>-</option>
                <template v-for="(item, index) in actorDataList">
                  <option
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </template>
              </select>
              <template v-if="dirty && invalid">
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </template>
            </div>
          </ValidationProvider>
        </div>
      </div>
      <div class="card-footer text-center">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click.stop.prevent="onClickRegister"
        >
          {{ displayLang.ACCESS_LIMIT_INSERT_BUTTON_LABEL }}
        </button>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as pageTypes from '@/store/types/accessLimitPageType';
import {
  AccessLimitPageAdapter,
  AccessLimitFormValues,
} from '@/store/types/adapters/accessLimitPageAdapter';
import {
  Actor,
  ActorData,
  ActorUtils,
} from '@/store/enum/Actor';

export default Vue.extend({
  name: 'Form',
  components: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    actorDataList(): ActorData[] {
      return ActorUtils.makeActorDataList(this.displayLang).filter(v => v.isAccessLimitTarget);
    },
    server: {
      get(): string {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        return formValues.server;
      },
      set(value: string) {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        formValues.server = value;
        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES, formValues);
      },
    },
    ip: {
      get(): string {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        return formValues.ip;
      },
      set(value: string) {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        formValues.ip = value;
        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES, formValues);
      },
    },
    domain: {
      get(): string {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        return formValues.domain;
      },
      set(value: string) {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        formValues.domain = value;
        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES, formValues);
      },
    },
    actor: {
      get(): number|null {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        return formValues.actor;
      },
      set(value: number|null) {
        const formValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
        formValues.actor = value;
        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES, formValues);
      },
    },
  },
  created() {
    this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CLEAR_FORM_VALUES);
    this.$nextTick(() => {
      const id = window.setTimeout(() => {
        if (!this.$refs.accessLimitInsertForm) {
          return;
        }
        window.clearTimeout(id);

        (this.$refs.accessLimitInsertForm as any).reset();
      }, 0);
    });
  },
  methods: {
    /**
     * フォームのバリデーションを行います。
     */
    formValidate(): Promise<boolean> {
      // フォームの要素をdirty状態に変更します。
      // dirty状態(そのinputに一度以上入力があった状態)に変更しないと、validation()のメッセージが表示されないため。
      [
        'serverInput',
        'ipInput',
        'domainInput',
        'actorInput',
      ].forEach((ref) => {
        const flags = {
          dirty: true,
          pristine: false,
        };

        (this.$refs[ref] as any).setFlags(flags);
      });
      return (this.$refs.accessLimitInsertForm as any).validate(false);
    },
    /**
     * [登録]ボタン押下時のイベントハンドラ
     */
    onClickRegister() {
      // フォームのバリデーションチェック
      this.formValidate()
        .then((valid:boolean) => {
          if (!valid) {
            return;
          }

          // 確認モーダル表示
          this.$modals.showSuccessConfirm('登録処理を続行して宜しいですか？', {title: '登録確認'})
            .then((ok: boolean) => {
              // [OK]ボタン以外は処理を行わない
              if (!ok) {
                return;
              }

              // フォームのバリデーションチェック
              this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
                .then(() => {
                  // INSERT APIを叩いて、成功したらリスト再取得する
                  return new Promise((resolve, reject) => {
                    this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_INSERT)
                      .catch(() => {
                        // エラーモーダル表示
                        this.$modals.showErrorAlert('登録処理に失敗しました。')

                        reject();
                      })
                      .then(() => {
                        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_SELECT)
                          .catch(() => {
                            // エラーモーダル表示
                            this.$modals.showErrorAlert('一覧の更新に失敗しました')
                              .finally(() => {
                                reject();
                              })
                          })
                          .then(() => {
                            resolve();
                          });
                      })
                  })
                })
                .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
            })
        })
    },
  },
});
</script>

<style></style>

