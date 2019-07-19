import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// shared modules
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../../../modules//shared/material/material.module';

// Containers
import { MealsComponent } from './containers/meals/meals.component';
import { MealComponent } from './containers/meal/meal.component';

// presentational / stateless components
import { MealFormComponent } from './components/meal-form/meal-form.component';

export const ROUTES: Routes = [
  { path: '', component: MealsComponent },
  { path: 'new', component: MealComponent },
  { path: ':id', component: MealComponent }
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
    MealsComponent,
    MealComponent,
    MealFormComponent
  ]
  // providers: []
})

export class MealsModule {}
