/* eslint-disable camelcase */
import { TesterDetailAdapter } from '@/store/types/adapters/testerDetailAdapter';
import { Message } from '@/store/types/adapters/webrtcMessageAdapter';

export class ExamineeLoginPageAdapter {
  constructor(
    public testerDetail: TesterDetailAdapter = new TesterDetailAdapter(),
    public messages: Message[] = [],
  ) {}
}
