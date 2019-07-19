import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// third-party modules - firebase
import { AngularFireModule } from '@angular/fire';
// third-party firebase
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// third-party firebase
import { AngularFirestore } from '@angular/fire/firestore';

// shared modules
import { SharedModule } from './shared/shared.module';

// constants
import { Constants } from '../../../constants/constants';

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
      { path: 'login', loadChildren: './login/login.module#LoginModule' },
      { path: 'register', loadChildren: './register/register.module#RegisterModule' }
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
