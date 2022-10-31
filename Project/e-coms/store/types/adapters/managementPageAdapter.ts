import {
  ManagementInitialParamAdapter,
  ManagementInitialParamRequestType,
  ManagementInitialParamResponseType,
} from '@/store/types/adapters/managementInitialParamAdapter';
import {
  ManagementSummaryAdapter,
  ManagementSummaryRequestType,
  ManagementSummaryResponseType,
} from '@/store/types/adapters/managementSummaryAdapter';

/* eslint-disable camelcase */
export class ManagementPageAdapter {
  constructor(
    public isInitialized: boolean = false,
    public managementInitialParamAdapter: ManagementInitialParamAdapter = new ManagementInitialParamAdapter(),
    public managementSummaryAdapter: ManagementSummaryAdapter = new ManagementSummaryAdapter(),
  ) {}
}
