/* eslint-disable camelcase */
export class TestersConditionsAdapter {
  constructor (
  ) {}
}

export type TestersConditions = {
  groups: { value: string }[],
  testNames: { value: string }[],
  regions: { value: string }[],
  records: { id: number, value: string }[],
  withMarks: { id: number, value: string }[],
  marks: { id: number, value: string }[],
  cheatingLevel: { id: number, value: string }[],
  aiAnalysisFlag: { id: number, value: string }[]
  times: { value: string }[],
};

export type TestersConditionsResult = {
  groups: { value: string }[],
  test_names: { value: string }[],
  regions: { value: string }[],
  records: { id: number, value: string }[],
  with_marks: { id: number, value: string }[],
  marks: { id: number, value: string }[],
  cheating_level: { id: number, value: string }[],
  ai_analysis_flag: { id: number, value: string }[],
  times: { value: string }[],
};

export type TestersConditionsResponseType = {
  status: number;
  message: string;
  result: {
    conditions: TestersConditionsResult;
  };
}
