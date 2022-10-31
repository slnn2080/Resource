/* eslint-disable camelcase */
import {
  DeleteSettingIndexAdapter,
} from '@/store/types/adapters/deleteSettingAdapter';

export class DeleteSettingPageAdapter {
  constructor(
    public deleteSettingIndexAdapter: DeleteSettingIndexAdapter = new DeleteSettingIndexAdapter(),
  ) {}
}
