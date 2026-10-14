import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/shared/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'schedule'
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        loadChildren: () => import('./modules/auth/login/login.routes').then(m => m.loginRoutes)
      },
      {
        path: 'register',
        loadChildren: () => import('./modules/auth/register/register.routes').then(m => m.registerRoutes)
      }
    ]
  },
  {
    path: 'schedule',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/nav-options/schedule/schedule.routes').then(m => m.scheduleRoutes)
  },
  {
    path: 'meals',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/nav-options/meals/meals.routes').then(m => m.mealsRoutes)
  },
  {
    path: 'workouts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/nav-options/workouts/workouts.routes').then(m => m.workoutsRoutes)
  },
  {
    path: '**',
    loadComponent: () => import('./modules/not-found/components/not-found.component').then(m => m.NotFoundComponent)
  }
];
