import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleControlsComponent } from './schedule-controls.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('ScheduleControlsComponent', () => {
  let component: ScheduleControlsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleControlsComponent, ...MATERIAL_IMPORTS]
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
