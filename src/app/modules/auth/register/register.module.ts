import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// containers
import { RegisterComponent } from './containers/register/register.component';

// shared
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../../shared/material/material.module';

export const ROUTES: Routes = [
  { path: '', component: RegisterComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    // shared
    SharedModule,
    MaterialModule
  ],
  declarations: [
    RegisterComponent
  ]
  // providers: []
})
export class RegisterModule {}
