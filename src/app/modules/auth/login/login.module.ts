import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// containers
import { LoginComponent } from './containers/login/login.component';

// shared
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../../shared/material/material.module';

export const ROUTES: Routes = [
  { path: '', component: LoginComponent }
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
    LoginComponent
  ]
  // providers: []
})
export class LoginModule {}
