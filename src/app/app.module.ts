import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// feature modules
import { AuthModule } from './modules/auth/auth.module';
import { NavOptionsModule } from './modules/nav-options/nav-options.module';
import { NotFoundModule } from './modules/not-found/not-found.module';

// shared modules
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './modules/shared/material/material.module';

// containers
import { AppComponent } from './containers/app/app.component';

// components
import { AppHeaderComponent } from './components/app/app-header/app-header.component';
import { AppNavComponent } from './components/app/app-nav/app-nav.component';

// constants
import { Constants } from 'src/constants/constants';

// store
import { Store } from './store/store';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppNavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    NavOptionsModule,
    NotFoundModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    Store,
    provideFirebaseApp(() => initializeApp(Constants.FIREBASE_CONFIG)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {}
