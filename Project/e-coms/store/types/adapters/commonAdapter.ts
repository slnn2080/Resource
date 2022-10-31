/* eslint-disable camelcase */
export class CommonAdapter {
  constructor(
    public isLayoutVisible: boolean = true,
    public headerLogoutButtonDisabled: boolean = false,
    // 0以下の時はローディング中フィルタ非表示, 0より大きいときはローディング中フィルタ表示
    public loadingCounter: number = 0,
    public uploadingAlertCounter: number = 0,
  ) {}
}

export enum LoadingAlertType {
  UPLOADING = 'uploading',
}

export type LoadingAlertOptions = {
  loadingAlertType: LoadingAlertType;
  visible: boolean;
}

