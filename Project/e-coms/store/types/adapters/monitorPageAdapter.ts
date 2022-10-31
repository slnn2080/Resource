/* eslint-disable camelcase */
import { TesterAdapter } from '@/store/types/adapters/testerAdapter';
import { MessageObject } from '@/plugins/kvs/type/sendMessageType';
import { ChatItemSender, ChatItem } from '@/store/enum/ChatItem';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { MatchingHistoriesAdapter } from '@/store/types/adapters/matchingHistoriesAdapter';

export class MonitorPageAdapter {
  constructor(
    public inAuth: boolean = false,

    public matchingHistories: MatchingHistoriesAdapter = new MatchingHistoriesAdapter(),
  ) {}
}

export class MonitorMatchingData {
  constructor(
    public matching: Matching | null = null, // TODO: この値はあくまでモニターへの割り当てのヒントであって、重要な値ではないかもしれない
    public chatItems: ChatItem[] = [],

    // TODO この値は、認証処理を行った場合にのみtrue/falseが設定される 認証処理を飛ばした場合は、この値は初期値のまま
    public authenticating: boolean = false,
    public accepted: boolean = false,
    public rejected: boolean = false,

    public elapsedTime: string = '--:--:--',
    public mediaStream: MediaStream | null = null,
    public muted: boolean = false,
    public audioSize: number = 0,

    public headShotUrl: string = '', // TODO: この値はs3のワンタイムパスなので使いまわしはできない / componentのwatchで変更検知したタイミングで別のワンタイムパスを発行していることに注意
    public headShotUrlLastUpdatedAt: number | null = null,
    public idCardUrl: string = '', // TODO: この値はs3のワンタイムパスなので使いまわしはできない / componentのwatchで変更検知したタイミングで別のワンタイムパスを発行していることに注意
    public idCardUrlLastUpdatedAt: number | null = null,
  ) {}
}
export class MonitorObject {
  constructor(
    // この値は固定
    public monitorId: number,
    public activation: boolean = true,

    // この値は、監視モニター切り替え時にMonitorObject間でスワップする
    public data: MonitorMatchingData = new MonitorMatchingData(),
  ) {}
}
export type MonitorObjectActions = {
  changeMainMonitor: (monitorObject: MonitorObject) => Promise<boolean>;
  setActivation: (monitorObject: MonitorObject, activation: boolean) => Promise<boolean>;
  addChatItem: (monitorObject: MonitorObject, params: {sender: ChatItemSender; message: string; messageObject: MessageObject;}) => Promise<boolean>;
  setAuthenticating: (monitorObject: MonitorObject, authenticating: boolean) => Promise<boolean>;
  setAccepted: (monitorObject: MonitorObject, accepted: boolean) => Promise<boolean>;
  setRejected: (monitorObject: MonitorObject, rejected: boolean) => Promise<boolean>;
  setMuted: (monitorObject: MonitorObject, muted: boolean) => Promise<boolean>;
  isNeedUpdateHeadShot: (monitorObject: MonitorObject) => boolean;
  updateHeadShot: (monitorObject: MonitorObject, params: {image: string, contentType: string}) => Promise<boolean>;
}

