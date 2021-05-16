import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// third-party modules - firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

// shared modules
import { SharedModule } from './shared/shared.module';

// constants
import { Constants } from 'src/constants/constants';

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    // firebase
    AngularFireModule.initializeApp(Constants.FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    // gets providers from static forRoot()
    SharedModule.forRoot()
  ],
  // declarations: [],
  providers: [
    AngularFirestore
  ]
})

export class AuthModule {}
