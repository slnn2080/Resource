/* eslint-disable camelcase */
import {
  AccessLimitSelectAdapter,
  AccessLimitSelectResponseResultItemType,
} from '@/store/types/adapters/accessLimitSelectAdapter';

export class AccessLimitPageAdapter {
  constructor(
    public formValues: AccessLimitFormValues = new AccessLimitFormValues(),
    public tableValues: AccessLimitTableValues = new AccessLimitTableValues(),
  ) {}
}

export class AccessLimitFormValues {
  constructor(
    public ip: string = '',
    public domain: string = '',
    public actor: number | null = null,
    public server: string = '',
  ) {}

  public clear(): void {
    this.ip = '';
    this.domain = '';
    this.actor = null;
    this.server = '';
  }
}

export class AccessLimitTableValues {
  constructor(
    public accessLimits: SelectableAccessLimit[] = [],
  ) {}

  public clear(): void {
    this.accessLimits.forEach(v => v.clear());
  }

  public setAccessLimits(adapter: AccessLimitSelectAdapter): AccessLimitTableValues {
    this.accessLimits = adapter.accessLimits.map(v => SelectableAccessLimit.fromResponse(v));

    return this;
  }
}

export class SelectableAccessLimit {
  constructor(
    public selected: boolean = false,

    public id: number = 0,
    public ip: string = '',
    public domain: string = '',
    public actor: number = 0,
    public server: string = '',
  ) {}

  public clear(): void {
    this.selected = false;
  }

  public static fromResponse(item: AccessLimitSelectResponseResultItemType): SelectableAccessLimit {
      const r = new SelectableAccessLimit();

      r.selected = false;

      r.id = item.id;
      r.ip = item.ip;
      r.domain = item.domain;
      r.actor = item.actor;
      r.server = item.server;

      return r;
  }
}

