import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDaysComponent } from './schedule-days.component';

describe('ScheduleDaysComponent', () => {
  let component: ScheduleDaysComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDaysComponent]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleDaysComponent).componentInstance;
  });

  it('should emit the selected day index', () => {
    spyOn(component.selectingDay, 'emit');

    component.selectDay(3);

    expect(component.selectingDay.emit).toHaveBeenCalledWith(3);
  });
});
