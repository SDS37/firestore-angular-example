import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// shared modules
import { MaterialModule } from 'src/app/modules//shared/material/material.module';

// components
import { ListItemComponent } from './components/list-item/list-item.component';

// services
import { MealsService } from './services/meals/meals.service';
import { WorkoutsService } from './services/workouts/workouts.service';
import { ScheduleService } from './services/schedule/schedule.service';

// pipes
import { JoinPipe } from './pipes/join.pipe';
import { WorkoutPipe } from './pipes/workout.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    ListItemComponent,
    JoinPipe,
    WorkoutPipe
  ],
  // providers: [],
  exports: [
    ListItemComponent,
    JoinPipe,
    WorkoutPipe
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        MealsService,
        WorkoutsService,
        ScheduleService
      ]
    };
  }
}
