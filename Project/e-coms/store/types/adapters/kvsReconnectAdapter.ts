/* eslint-disable camelcase */
import { TesterState } from '@/store/enum/TesterState';
import { MatchingStatus } from '@/store/enum/MatchingStatus';
import { SignalingChannel, Matching, MatchingResultResponseType } from '@/store/types/adapters/matchingAdapter';

export class KvsReconnectAdapter {
  constructor(
    public matchingLikeObject: MatchingLikeObject | null = null,
  ) {}

  static fromResponse(response: KvsReconnectResponseType): KvsReconnectAdapter {
    const r = new KvsReconnectAdapter()

    if (response.result) {
      r.matchingLikeObject = Matching.fromResponse(response.result)
    }

    return r
  }
}

export type MatchingLikeObject = Matching;

export type KvsReconnectRequestType = {
  tester_id: number;
}

export type KvsReconnectResponseResultType = MatchingResultResponseType;

export type KvsReconnectResponseType = {
  status: number;
  message: string;
  result?: KvsReconnectResponseResultType | null;
};
