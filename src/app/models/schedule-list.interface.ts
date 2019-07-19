import { ScheduleItem } from './schedule-item.interface';

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snacks?: ScheduleItem;
  [key: string]: any;
}
// [key: string]: any; access by index lookup
