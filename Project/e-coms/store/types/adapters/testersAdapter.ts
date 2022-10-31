/* eslint-disable camelcase */
export class TestersAdapter {
  constructor(
  ) {}
}

export class Tester {
  public testId: number | null = null;
  public group: string = '';
  public testName: string | null = null;
  public region: string = '';
  public testAt: string | null = null;
  public stopAt: string | null = null;
  public examName: string = '';
  public withMark: number = 0;
  public record: number | null = null;
  public userId: number = 0;
  public loginId: string = '';
  public cheatingLevel: number | null = null;
  public totalScore: number = 0;
}

export class SelectableTester {
  constructor(
    public tester: Tester = new Tester(),
    public selected: boolean = false,
    public disabled: boolean = false,
  ){}
}

export type TestersRequestType = {
  group: string | null;
  group_text/*group_code*/: string | null;
  login_id: string | null;
  test_name: string | null;
  region: string | null;
  test_at_date_from: string | null;
  test_at_date_to: string | null;
  test_at_time_from: string | null;
  test_at_time_to: string | null;
  exam_name: string | null;
  is_like_search: number | null;
  record: number | null;
  with_mark: number | null;
  cheating_level_from: number | null;
  cheating_level_to: number | null;
  score: number | null;
  ai_analysis_flag: number | null;
  ai_analysis_batch_flag: number | null;
  ai_namematch: number | null;
  mark_id: number | null;
  sort_key: number | null;
  sort_order: number | null;
  page: number | null;
};

export type TestersResultItem = {
  test_id: number | null;
  group: string;
  test_name: string | null;
  region: string;
  test_at: string | null;
  stop_at: string | null;
  exam_name: string;
  with_mark: number;
  record: number | null;
  user_id: number;
  login_id: string;
  cheating_level: number | null;
  total_score: number;
};

export type TestersResponseType = {
  status: number;
  message: string;
  result: {
    count: number;
    page_count: number;
    page: number;
    testers: TestersResultItem[];
  };
};
