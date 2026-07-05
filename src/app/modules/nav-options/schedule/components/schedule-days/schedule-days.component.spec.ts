import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDaysComponent } from './schedule-days.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('ScheduleDaysComponent', () => {
  let component: ScheduleDaysComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDaysComponent, ...MATERIAL_IMPORTS]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleDaysComponent).componentInstance;
  });

  it('should emit the selected day index', () => {
    spyOn(component.selectingDay, 'emit');

    component.selectDay(3);

    expect(component.selectingDay.emit).toHaveBeenCalledWith(3);
  });
});
