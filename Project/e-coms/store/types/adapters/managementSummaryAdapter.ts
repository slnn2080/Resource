/* eslint-disable camelcase */
export class ManagementSummaryAdapter {
  constructor(
    public logins: {
      testerCount: number;
      otherCount: number;
    } = {
      testerCount: 0,
      otherCount: 0,
    },
    public deletePlan: {
      testerCount: number;
      recordCount: number;
    } = {
      testerCount: 0,
      recordCount: 0,
    },
  ) {
  }

  /**
   * レスポンスを設定する
   *
   * @param {ManagementSummaryResponseResultType} response
   * @return {ManagementSummaryAdapter}
   */
  public static fromResponse(response: ManagementSummaryResponseResultType | null): ManagementSummaryAdapter {
    const r = new ManagementSummaryAdapter()

    if (response) {
      const response2 = response as ManagementSummaryResponseResultType

      r.logins = {
        testerCount: response2.logins.tester_count as number,
        otherCount:  response2.logins.other_count as number,
      }
      r.deletePlan = {
        testerCount: response2.delete_plan.tester_count as number,
        recordCount: response2.delete_plan.record_count as number,
      }
    }

    return r
  }
}
export type ManagementSummaryRequestType = {
};

export type ManagementSummaryResponseResultType = {
  logins: {
    tester_count: number;
    other_count: number;
  },
  delete_plan: {
    tester_count: number;
    record_count: number;
  },
};

export type ManagementSummaryResponseType = {
  status: number;
  message: string;
  result: ManagementSummaryResponseResultType | null;
};
