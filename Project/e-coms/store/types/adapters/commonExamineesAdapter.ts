/* eslint-disable camelcase */
import {
  Tester,
  SelectableTester,
  TestersAdapter,
  TestersRequestType,
  TestersResponseType,
} from '@/store/types/adapters/testersAdapter';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';


export class CommonExamineesAdapter {
  constructor(
    // 検索条件の選択肢
    public conditions: TestersConditions = {
      groups: [],
      testNames: [],
      regions: [],
      records: [],
      withMarks: [],
      marks: [],
      cheatingLevel: [],
      aiAnalysisFlag: [],
      times: [],
    },
    // テスター検索フォーム
    public formValues: CommonExamineesFormValues = new CommonExamineesFormValues(),
    public formValuesForDownload: CommonExamineesFormValues | null = null,
    // テスター検索結果
    public count: number = 0,
    public pageCount: number = 0,
    public testers: Tester[] = [],
    public selectableTesters: SelectableTester[] = [],
    public selectedAll: boolean = false,
  ){}
}

export class CommonExamineesFormValues {
  public constructor(
    public group: string | null = '',
    public groupCode: string | null = '',
    public loginId: string | null = '',
    public examName: string | null = '',
    public isLikeSearch: number | null = null,
    public testName: string | null = '',
    public region : string | null = '',
    public testAtDateFrom: string | null = '',
    public testAtDateTo: string | null = '',
    public testAtTimeFrom: string | null = '',
    public testAtTimeTo: string | null = '',
    public record: number | null = null,
    public withMark: number | null = null,
    public cheatingLevelFrom: number | null = null,
    public cheatingLevelTo: number | null = null,
    public score: number | null = null,
    public aiAnalysisFlag: number | null = null,
    public aiAnalysisBatchFlag: number | null = null,
    public aiNameMatch: number | null = null,
    public markId: number | null = null,
    public sortKey: number | null = null,
    public sortOrder: number | null = null,
    public page: number = 1,
  ) {
    this.reset()
  }

  /**
   * リセットします
   */
  public reset() {
    this.group = '';
    this.groupCode = '';
    this.loginId = '';
    this.examName = '';
    this.isLikeSearch = null;
    this.testName = '';
    this.region = '';
    this.testAtDateFrom = '';
    this.testAtDateTo = '';
    this.testAtTimeFrom = '';
    this.testAtTimeTo = '';
    this.record = null;
    this.withMark = null;
    this.cheatingLevelFrom = null;
    this.cheatingLevelTo = null;
    this.score = null;
    this.aiAnalysisFlag = null;
    this.aiAnalysisBatchFlag = null;
    this.aiNameMatch = null;
    this.markId = null;
    this.sortKey = null;
    this.sortOrder = null;
    this.page = 1;
  }

  /**
   * クローンします
   */
  public clone(): CommonExamineesFormValues {
    const r = new CommonExamineesFormValues()

    r.group               = this.group
    r.groupCode           = this.groupCode
    r.loginId             = this.loginId
    r.examName            = this.examName
    r.isLikeSearch        = this.isLikeSearch
    r.testName            = this.testName
    r.region              = this.region
    r.testAtDateFrom      = this.testAtDateFrom
    r.testAtDateTo        = this.testAtDateTo
    r.testAtTimeFrom      = this.testAtTimeFrom
    r.testAtTimeTo        = this.testAtTimeTo
    r.record              = this.record
    r.withMark            = this.withMark
    r.cheatingLevelFrom   = this.cheatingLevelFrom
    r.cheatingLevelTo     = this.cheatingLevelTo
    r.score               = this.score
    r.aiAnalysisFlag      = this.aiAnalysisFlag
    r.aiAnalysisBatchFlag = this.aiAnalysisBatchFlag
    r.aiNameMatch         = this.aiNameMatch
    r.markId              = this.markId
    r.sortKey             = this.sortKey
    r.sortOrder           = this.sortOrder
    r.page                = this.page

    return r
  }

  /**
   * リクエストに変換します
   *
   * @return {TestersRequestType}
   */
  public toTestersRequest(): TestersRequestType {
    return {
      group                 : this.group,
      group_text            : this.groupCode,
      login_id              : this.loginId,
      test_name             : this.testName,
      region                : this.region,
      test_at_date_from     : this.testAtDateFrom,
      test_at_date_to       : this.testAtDateTo,
      test_at_time_from     : this.testAtTimeFrom,
      test_at_time_to       : this.testAtTimeTo,
      exam_name             : this.examName,
      is_like_search        : this.isLikeSearch,
      record                : this.record,
      with_mark             : this.withMark,
      cheating_level_from   : this.cheatingLevelFrom,
      cheating_level_to     : this.cheatingLevelTo,
      score                 : this.score,
      ai_analysis_flag      : this.aiAnalysisFlag,
      ai_analysis_batch_flag: this.aiAnalysisBatchFlag,
      ai_namematch          : this.aiNameMatch,
      mark_id               : this.markId,
      sort_key              : this.sortKey,
      sort_order            : this.sortOrder,
      page                  : this.page,
    }
  }
}
