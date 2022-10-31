/* eslint-disable camelcase */
import {
  LoginsAdapter,
  LoginsRequestType,
  LoginsResponseType,
  ActorKind,
  SortKey,
  SortOrder
} from '@/store/types/adapters/loginsAdapter';

export class LoginsPageAdapter {
  constructor(
    public formValues: LoginsFormValues = new LoginsFormValues(),
    public tableValues: LoginsTableValues = new LoginsTableValues(),
  ) {}
}

export class LoginsFormValues {
  public actorKind: ActorKind = ActorKind.TESTER;
  public page: number | null = null;
  public sortKey: SortKey | null = null;
  public sortOrder: SortOrder | null = null;

  constructor(
  ) {
    this.clear()
  }

  public clear() {
    this.actorKind = ActorKind.TESTER
    this.page = null
    this.sortKey = null
    this.sortOrder = null
  }

  public getLoginsRequest(): LoginsRequestType {
    return {
      actor_kind:  this.actorKind,
      page:       this.page,
      sort_key:   this.sortKey,
      sort_order: this.sortOrder,
    }
  }
}

export class LoginsTableValues {
  public loginsAdapter: LoginsAdapter = new LoginsAdapter();

  constructor(
  ) {
    this.clear()
  }

  public clear() {
    this.loginsAdapter = new LoginsAdapter()
  }
 
  public setLoginsAdapter(loginsAdapter: LoginsAdapter) {
    this.loginsAdapter = loginsAdapter
  }
}

