export type kvsConfigType = {
  region: string;
  accessKeyId: string;
  channelName: string;
  secretAccessKey: string;
  sessionToken?: string;

  clientId?: string;
  endpoint?: string;
  openDataChannel?: boolean;
  useTrickleICE?: boolean;
  natTraversalDisabled?: boolean;
  forceTURN?: boolean;
};

export class KVSConfig {
  public region: string = 'ap-northeast-1';
  public accessKeyId: string = '';
  public channelName: string = '';
  public secretAccessKey: string = '';
  public sessionToken?: string = undefined;

  public clientId: string = '';
  public endpoint?: string = undefined;
  public openDataChannel: boolean = true;
  public useTrickleICE: boolean = true;
  public natTraversalDisabled: boolean = false;
  public forceTURN: boolean = false;

  constructor(
    config: kvsConfigType = {
      region: 'ap-northeast-1',
      accessKeyId: '',
      channelName: '',
      secretAccessKey: '',
      sessionToken: undefined,
    },
  ) {
    Object.assign(this, config);
  }
}
