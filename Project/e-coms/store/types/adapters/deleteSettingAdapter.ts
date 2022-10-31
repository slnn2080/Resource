/* eslint-disable camelcase */

/**
 * 一覧
 */
export class DeleteSettingIndexAdapter {
  constructor(
    public list: DeleteSetting[] = [],
  ) {
  }

  /**
   * レスポンスからアダプターを生成します
   *
   * @param {DeleteSettingIndexResponseType} response
   * @return {DeleteSettingIndexAdapter}
   */
  public static fromResponse(response: DeleteSettingIndexResponseType): DeleteSettingIndexAdapter {
    const r = new DeleteSettingIndexAdapter()

    r.list = response.result.list.map((v: DeleteSettingResponse) => {
      return {
        id: v.id,
        groupId: v.group_id,
        duration: v.duration,
        updatedAt: v.updated_at,
      }
    })

    return r
  }
}

export enum DeleteSettingSpecialGroupId {
  SYSTEM_LOG      = '__NOT_GROUP_ID_LOG',
  MONITOR_HISTORY = '__NOT_GROUP_ID_MONITOR',
  DEFAULT_SETTING = '__GROUP_ID_OTHER',
}

export type DeleteSetting = {
  id: number | null;
  groupId: string;
  duration: number | null;
  updatedAt: string | null;
}

export type DeleteSettingIndexRequestType = {
};

export type DeleteSettingResponse = {
  id: number;
  group_id: string;
  duration: number;
  updated_at: string;
}
export type DeleteSettingIndexResponseResultType = {
  list: DeleteSettingResponse[];
}

export type DeleteSettingIndexResponseType = {
  status: number;
  message: string;
  result: DeleteSettingIndexResponseResultType;
};

/**
 * 新規作成
 */
export class DeleteSettingStoreAdapter {
  constructor(
  ) {
  }

  /**
   * レスポンスからアダプターを生成します
   *
   * @param {DeleteSettingStoreResponseType} response
   * @return {DeleteSettingStoreAdapter}
   */
  public static fromResponse(response: DeleteSettingStoreResponseType): DeleteSettingStoreAdapter {
    const r = new DeleteSettingStoreAdapter()

    return r
  }
}

export type DeleteSettingStoreRequestType = {
  group_id: string;
  duration: number;
};

export type DeleteSettingStoreResponseResultType = {
}

export type DeleteSettingStoreResponseType = {
  status: number;
  message: string;
  result: DeleteSettingStoreResponseResultType;
};

/**
 * 更新
 */
export class DeleteSettingUpdateAdapter {
  constructor(
  ) {
  }

  /**
   * レスポンスからアダプターを生成します
   *
   * @param {DeleteSettingUpdateResponseType} response
   * @return {DeleteSettingUpdateAdapter}
   */
  public static fromResponse(response: DeleteSettingUpdateResponseType): DeleteSettingUpdateAdapter {
    const r = new DeleteSettingUpdateAdapter()

    return r
  }
}


export type DeleteSettingUpdateRequestType = {
  group_id: string;
  duration: number;
};

export type DeleteSettingUpdateResponseResultType = {
}

export type DeleteSettingUpdateResponseType = {
  status: number;
  message: string;
  result: DeleteSettingUpdateResponseResultType;
};
