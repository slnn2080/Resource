import { Marking, Record } from "@/store/types/adapters/commonMarkingTimelineAdapter"

/* eslint-disable camelcase */
export class TestMarkingsAdapter {
  constructor(
    public testId: number | null = 0,
    public markings: Marking[] = [],
    public markingTotalScore: number = 0,
    public records: Record[] = [],
  ) {}
}

// マーキング情報取得結果
type MarkingResult = {
  marking_at: string;
  url: string;
  mark: string;
  record_id: number;
};

// レコード情報取得結果
type RecordResult = {
  id: string;
  start_at: string;
  stop_at: string;
  url: string | null;
};

type Result = {
  markings: MarkingResult[];
  marking_total_score: number;
  records: RecordResult[];
};

export type TestMarkingsRequestType = {
  test_id: number;
};

export type TestMarkingsResponseType = {
  status: number;
  result: Result;
  message: string;
};
