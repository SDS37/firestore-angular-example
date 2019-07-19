import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
// import { NotFoundComponent } from './modules/not-found/components/not-found.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'schedule',
    // component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    ROUTES,
    // develop mode
    { enableTracing: false }
  )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
