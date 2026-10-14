import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleControlsComponent } from './schedule-controls.component';

describe('ScheduleControlsComponent', () => {
  let component: ScheduleControlsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleControlsComponent]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleControlsComponent).componentInstance;
  });

  it('should emit week offsets', () => {
    spyOn(component.movingDate, 'emit');

    component.moveDate(-1);

    expect(component.offset).toBe(-1);
    expect(component.movingDate.emit).toHaveBeenCalledWith(-1);
  });
});
