/* eslint-disable camelcase */
export class DeletePlanAdapter {
  constructor(
  ) {}
}

export enum DeletePlanKey {
  TESTER = 'tester',
  RECORD = 'record',
}
export type DeletePlanRequestType = {
  key: DeletePlanKey;
  execution_time: string;
};

export type DeletePlanResponseType = {
};

export type TestersResponseType = {
  status: number;
  message: string;
  result: DeletePlanResponseType;
};
