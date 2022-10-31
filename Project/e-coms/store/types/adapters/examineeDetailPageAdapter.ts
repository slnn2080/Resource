/* eslint-disable camelcase */
import { TesterDetailAdapter } from '@/store/types/adapters/testerDetailAdapter';

export class ExamineeDetailPageAdapter {
  constructor(
    public testerDetail: TesterDetailAdapter = new TesterDetailAdapter(),
    public status: Number = 0,
  ) {}
}

