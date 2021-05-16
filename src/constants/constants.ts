// firebase
import { FirebaseAppConfig } from '@angular/fire';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
