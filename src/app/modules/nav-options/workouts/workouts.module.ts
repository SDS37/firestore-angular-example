import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// shared modules
import { SharedModule } from 'src/app/modules/nav-options/shared/shared.module';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

// Containers
import { WorkoutsComponent } from './containers/workouts/workouts.component';
import { WorkoutComponent } from './containers/workout/workout.component';

// presentational / stateless components
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutTypeComponent } from './components/workout-type/workout-type.component';

export const ROUTES: Routes = [
  { path: '', component: WorkoutsComponent },
  { path: 'new', component: WorkoutComponent },
  { path: ':id', component: WorkoutComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    // shared modules
    SharedModule,
    MaterialModule
  ],
  declarations: [
    WorkoutComponent,
    WorkoutsComponent,
    WorkoutFormComponent,
    WorkoutTypeComponent
  ]
  // providers: []
})

export class WorkoutsModule {}
