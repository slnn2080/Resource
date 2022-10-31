import {
  DeletePlanAdapter,
  DeletePlanRequestType,
  DeletePlanResponseType,
  DeletePlanKey,
} from '@/store/types/adapters/deletePlanAdapter';
import { Formatter } from '@/utils/Formatter'

/* eslint-disable camelcase */
export class DeletePlanPageAdapter {
  constructor(
    public formValues: DeletePlanFormValues = new DeletePlanFormValues(),
  ) {}
}

export class DeletePlanFormValues {
  public deletePlanKey: DeletePlanKey = DeletePlanKey.TESTER;
  public date: string = '';

  constructor(
  ) {
    this.clear()
  }

  public clear() {
    this.deletePlanKey = DeletePlanKey.TESTER
    this.date = Formatter.date('yyyy-MM-dd', new Date())
  }
}
