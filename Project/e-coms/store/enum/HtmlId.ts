/**
 * 複数のソースファイルをまたいでHTMLのidが使用される場合、
 * 不用意にidが変更される可能性があるのでこちらで定義しています
 */
export enum HtmlId {
  // 共通
  GLOBAL_ALERT_MODAL = 'global-alert-modal',
  GLOBAL_CONFIRM_MODAL = 'global-confirm-modal',

  // 「監視画面」
  MONITOR_AUTH_MODAL = 'modal-auth',
  MONITOR_MARKING_MODAL = 'modal-marking',
  MONITOR_HISTORY_MODAL = 'modal-history',

  // 「管理画面」削除設定
  DELETE_SETTING_CREATE_MODAL = 'delete-setting-create-modal',
  DELETE_SETTING_EDIT_MODAL = 'delete-setting-edit-modal',
}

