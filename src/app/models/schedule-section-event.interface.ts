import { ScheduleItem } from './schedule-item.interface';

export interface ScheduleSectionEvent {
  type: string;
  assigned: string[];
  data: ScheduleItem;
  section: string;
  day: Date;
}
