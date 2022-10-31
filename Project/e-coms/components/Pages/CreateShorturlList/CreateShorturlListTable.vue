<template>
  <div>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th class="w5p"></th>
          <th class="w20p">
            {{ displayLang.CREATE_SHORTURL_LIST_LOGIN_CATEGORY }}
          </th>
          <th class="w25p">
            {{ displayLang.CREATE_SHORTURL_LIST_URLKEY }}
          </th>
          <th class="w20p">
            {{ displayLang.CREATE_SHORTURL_LIST_SERVER }}
          </th>
          <th class="w15p">
            {{ displayLang.CREATE_SHORTURL_CHANGE_DATE }}
          </th>
          <th class="w15p"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(shortUrl, index) in shortUrls">
          <tr class="clickable">
            <td class="text-center">
              <input
                v-model="deleteTargets.id"
                :value="shortUrl.id"
                type="checkbox"
                class="form-control-input"
              />
            </td>
            <td>{{ toActorName(shortUrl.actor) }}</td>
            <td>{{ shortUrl.url_key }}</td>
            <td>{{ shortUrl.target }}</td>
            <td>{{ shortUrl.updatedAt }}</td>
            <td>
            <input
              type="button"
              :value="displayLang.CREATE_SHORTURL_LIST_CHANGE_BUTTON_LABEL"
              class="btn btn-primary"
              @click.stop.prevent="onClickUpdate(shortUrl.id)"
            />
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="text-center">
            <input
              type="button"
              :value="displayLang.CREATE_SHORTURL_LIST_DELETE_BUTTON_LABEL"
              class="btn btn-danger"
              @click.stop.prevent="onClickDelete()"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LanguageEnum } from "~/store/enum/language";
import * as commonTypes from "@/store/types/commonType";
import * as rootTypes from "@/store/types/rootType";
import * as createShortUrlPageTypes from "@/store/types/createShortUrlPageType";
import {
  CreateShortUrlDeleteRequestType,
  ShortUrl,
} from "@/store/types/adapters/createShortUrlAdapter";
import { Actor, ActorData, ActorUtils } from "@/store/enum/Actor";

export default Vue.extend({
  name: "CreateShorturlListTable",
  components: {
  },
  data() {
    return {
      deleteTargets: { id : []},
    };
  },
  created() {
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
      .then(() =>
          new Promise((resolve) => {
            Promise.all([
              this.$store.dispatch(createShortUrlPageTypes.ACTION_SELECT_SHORTEN_URL_GET)
            ])
            .finally(() => {
              resolve(true)
            })
          })
      )
      .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    shortUrls(): ShortUrl {
      const tableValues = this.$store.getters[createShortUrlPageTypes.GETTER_SELECT_SHORTEN_URL_LIST]
      return tableValues;
    },
  },
  methods: {
    toActorName(actorId: number): string {
      return ActorUtils.toString(actorId as Actor, this.displayLang);
    },
    onClickUpdate(id: number) {
      this.$router.push('/create-shorturl/' + id)
    },
    onClickDelete() {
      this.$modals
        .showSuccessConfirm("削除処理を続行して宜しいですか？", { title: "削除確認" })
        .then((ok: boolean) => {
          // [OK]ボタン以外は処理を行わない
          if (!ok) {
            return;
          }
          
          // リクエスト用にIDを整形
          const reqId = this.deleteTargets.id.join();
          const reqParam = { id : JSON.stringify(reqId) };

          this.$store
            .dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
            .then(() => {
              // deleteが成功したらリストを再取得する
              return new Promise((resolve, reject) => {
                this.$store
                  .dispatch(
                    createShortUrlPageTypes.ACTION_DELETE_SHORTEN_URL_POST,
                    reqParam
                  )
                  .catch(() => {
                    // エラーモーダル表示
                    this.$modals.showErrorAlert("削除処理に失敗しました。");

                    reject();
                  })
                  .then(() => {
                    this.$store
                      .dispatch(createShortUrlPageTypes.ACTION_SELECT_SHORTEN_URL_GET)
                      .catch(() => {
                        // エラーモーダル表示
                        this.$modals
                          .showErrorAlert("一覧の更新に失敗しました。")
                          .finally(() => {
                            reject();
                          });
                      })
                      .then(() => {
                        resolve();
                      });
                  });
              });
            })
            .finally(() =>
              this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false)
            );
        });
    },
  },
});
</script>

<style></style>
