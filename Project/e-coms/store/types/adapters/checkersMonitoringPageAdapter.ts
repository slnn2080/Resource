/* eslint-disable camelcase */
import { Matching, Tester } from '@/store/types/adapters/checkersMonitoringAdapter';

export class CheckersMonitoringPageAdapter {
  constructor(
    public matchings: Matching[] = [],
    public notMatchings: Tester[] = [],
    public kickedUsers: Tester[] = [],
  ) {}
}
