<template>
  <div>
    <template v-if="accessLimits.length === 0">
      <div class="alert alert-success search-result"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 該当するデータは存在しません</div>
    </template>
    <template v-else>
      <ValidationObserver
        ref="accessLimitDeleteForm"
        v-slot="{ invalid, errors }"
        slim
      >
        <table class="table table-bordered table-striped user-list">
          <thead>
            <tr>
              <th class="w5p"></th>
              <th class="w25p sort-th">
                {{ displayLang.ACCESS_LIMIT_TABLE_HEADER_TITLE_SERVER }}
              </th>
              <th class="w25p sort-th">
                {{ displayLang.ACCESS_LIMIT_TABLE_HEADER_TITLE_IP }}
              </th>
              <th class="w25p sort-th">
                {{ displayLang.ACCESS_LIMIT_TABLE_HEADER_TITLE_DOMAIN }}
              </th>
              <th class="w20p sort-th">
                {{ displayLang.ACCESS_LIMIT_TABLE_HEADER_TITLE_ACTOR }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in accessLimits">
              <tr
                class="clickable"
                @click="onClickRecord(item, index)"
              >
                <td class="text-center">
                  <ValidationProvider
                    name="レコード"
                    rules="some_json:selectedListJsonString"
                    slim
                  >
                    <input
                      v-model="item.selected"
                      type="checkbox"
                      @click.stop=""
                    >
                  </ValidationProvider>
                </td>
                <td>{{ item.server }}</td>
                <td>{{ item.ip || '-' }}</td>
                <td>{{ item.domain || '-'}}</td>
                <td>{{ toActorName(item.actor) }}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="card-footer text-center">
                <input
                  type="button"
                  :value="displayLang.ACCESS_LIMIT_DELETE_BUTTON_LABEL"
                  class="btn btn-sm btn-primary"
                  :class="[invalid ? 'is-invalid' : '']"
                  @click.stop.prevent="onClickDelete"
                >
                <template v-if="getErrorMessage(errors)">
                  <div class="invalid-feedback">
                    {{ getErrorMessage(errors) }}
                  </div>
                </template>
              </td>
            </tr>
          </tfoot>
        </table>
        <ValidationProvider
          vid="selectedListJsonString"
          rules="some_json:selectedListJsonString"
          slim
        >
          <input
            v-model="selectedListJsonString"
            type="hidden"
          >
        </ValidationProvider>
      </ValidationObserver>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as pageTypes from '@/store/types/accessLimitPageType';
import {
  AccessLimitTableValues,
  SelectableAccessLimit,
} from '@/store/types/adapters/accessLimitPageAdapter';
import {
  Actor,
  ActorData,
  ActorUtils,
} from '@/store/enum/Actor';

export default Vue.extend({
  name: 'Table',
  components: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    accessLimits(): SelectableAccessLimit[] {
      const tableValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES];
      return tableValues.accessLimits;
    },
    selectedList(): boolean[] {
      const tableValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES];
      return (tableValues.accessLimits as SelectableAccessLimit[]).map(v => v.selected);
    },
    selectedListJsonString(): string {
      return JSON.stringify(this.selectedList);
    },
  },
  created() {
    this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CLEAR_TABLE_VALUES);
  },
  methods: {
    toActorName(actorId: number): string {
      return ActorUtils.toString(actorId as Actor, this.displayLang);
    },
    getErrorMessage(errors: {[key:string]:string[];}): string {
      for (const inputName in errors) {
        const messages = errors[inputName];
        if (messages.length > 0) {
          return messages[0];
        }
      }
      return '';
    },
    onClickRecord(item: SelectableAccessLimit, index: number) {
      const tableValues = this.$store.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES];

      tableValues.accessLists = (tableValues.accessLimits as SelectableAccessLimit[]).map(
        function(v) {
          if (v.id == item.id) {
            v.selected = !v.selected;
          }
          return v;
        }
      );

      this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_TABLE_VALUES, tableValues);
    },
    /**
     * [登録]ボタン押下時のイベントハンドラ
     */
    onClickDelete() {
      // フォームのバリデーションチェック
      (this.$refs.accessLimitDeleteForm as any).validate(false)
        .then((valid:boolean) => {
          if (!valid) {
            return;
          }

          // 確認モーダル表示
          this.$modals.showSuccessConfirm('削除処理を続行して宜しいですか？', {title: '削除確認'})
            .then((ok: boolean) => {
              // [OK]ボタン以外は処理を行わない
              if (!ok) {
                return;
              }

              this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
                .then(() => {
                  // DELETE APIを叩いて、成功したらリスト再取得する
                  return new Promise((resolve, reject) => {
                    this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_DELETE)
                      .catch(() => {
                        // エラーモーダル表示
                        this.$modals.showErrorAlert('登録処理に失敗しました。')
                          .then(() => {
                            reject()
                          })
                      })
                      .then(() => {
                        this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_SELECT)
                          .catch(() => {
                            // エラーモーダル表示
                            this.$modals.showErrorAlert('一覧の更新に失敗しました。')
                              .then(() => {
                                reject()
                              })
                          })
                          .then(() => {
                            resolve();
                          });
                      })
                  });
                })
                .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
            })
        })
    },
  },
});
</script>

<style></style>


