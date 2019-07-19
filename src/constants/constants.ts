// firebase
import { FirebaseAppConfig } from '@angular/fire';

// material
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatProgressBarModule,
  MatDividerModule,
  MatCardModule,
  MatListModule } from '@angular/material';
// disable angular material animations
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

export class Constants {

  public static FIREBASE_CONFIG: FirebaseAppConfig = {
    apiKey: 'AIzaSyB92cP5jN2Wei9UxZt76UTiOJ3yZbwfXY4',
    authDomain: 'fir-example-app-5c3d3.firebaseapp.com',
    databaseURL: 'https://fir-example-app-5c3d3.firebaseio.com',
    projectId: 'fir-example-app-5c3d3',
    storageBucket: 'fir-example-app-5c3d3.appspot.com',
    messagingSenderId: '667771037639',
    appId: '1:667771037639:web:3878c068bec8c16f'
  };

  public static ANGULAR_MATERIAL_MODULES: any[] = [
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule,
      MatIconModule,
      MatProgressBarModule,
      MatDividerModule,
      MatCardModule,
      MatListModule
  ];

}
