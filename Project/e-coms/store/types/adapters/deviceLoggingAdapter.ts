/* eslint-disable camelcase */
export class DeviceLoggingAdapter {
  constructor(
  ) {
  }

  public static fromResponse(response: DeviceLoggingResponseType) {
    const r = new DeviceLoggingAdapter()

    return r
  }
}

export type DeviceLoggingRequestType = {
  is_pc: boolean;
  current_device_id: string | null;
  device_id: string | null;
  group_id: string | null;
  kind: string | null;
  label: string | null;
  json: string | null;
};

export type DeviceLoggingResponseResultType = {
};

export type DeviceLoggingResponseType = {
  status: number;
  message: string;
  result: DeviceLoggingResponseResultType;
};
