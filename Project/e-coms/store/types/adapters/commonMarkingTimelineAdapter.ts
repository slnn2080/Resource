/* eslint-disable camelcase */
export class CommonMarkingTimelineAdapter {
  constructor(
  ) {}
}

// マーキング情報配列構造体
export class Marking {
  constructor(
    public markingAt: string | null = '',
    public url: string | null = '',
    public mark: string | null = '',
    public recordId: number = 0,
  ) {
  }
}
// マーキング情報配列構造体
export class ExtendMarking extends Marking {
  public recordIndex: number = -1;
  public recordUrl: string | null = null;
  public recordTime: number = 0;

  /**
   *
   *
   * @param {Marking} marking
   * @param {number} recordIndex
   * @param {string | null} recordUrl
   * @param {number} recordTime
   * @return {ExtendMarking}
   */
  public static createInstance(
    marking: Marking,
    recordIndex: number,
    recordUrl: string | null,
    recordTime: number
  ): ExtendMarking {
    const r = new ExtendMarking()

    r.markingAt   = marking.markingAt
    r.url         = marking.url
    r.mark        = marking.mark
    r.recordId    = marking.recordId
    r.recordIndex = recordIndex
    r.recordUrl   = recordUrl
    r.recordTime  = recordTime

    return r
  }
}

// レコード情報配列構造体
export type Record = {
  id: string;
  startAt: string;
  stopAt: string;
  url: string | null;
  playTimeFrom: string | null;
  playTimeTo: string | null;
}

// 再生情報配列構造体
export type VideoPlayData = {
  url: string;
  startTime: number;
}
