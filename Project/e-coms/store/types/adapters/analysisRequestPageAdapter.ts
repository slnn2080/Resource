import { SelectableTester } from '@/store/types/adapters/testersAdapter';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';
import { AnalysisRequest } from '@/store/types/adapters/analysisRequestIndexApiAdapter';

/* eslint-disable camelcase */
export class AnalysisRequestPageAdapter {
  constructor(
    // AI解析依頼初期パラメータ
    public initialParam: AnalysisRequestInitialParam = new AnalysisRequestInitialParam(),
    // AI解析依頼フォーム
    public formValues: AnalysisRequestFormValues = new AnalysisRequestFormValues(),
    // AI解析依頼テーブル
    public tableValues: AnalysisRequestTableValues = new AnalysisRequestTableValues(),
  ){}
}

export class AnalysisRequestInitialParam {
  constructor(
    public domain: string = '',
    public env: string = '',
  ) {}
}
export class AnalysisRequestFormValues {
  constructor(
    public analysisInseq: number | null = null,
    public analysisStatus: number | null = null,
  ) {}

  public clear(): void {
    this.analysisInseq = null;
    this.analysisStatus = null;
  }
}
export class AnalysisRequestTableValues {
  constructor(
    public analysisRequests: AnalysisRequest[] = [],
    public sortKey: number | null = null,
    public sortOrder: number | null = null,
  ) {}
}

