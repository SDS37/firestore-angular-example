import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

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

// environments
import { environment } from '../environments/environment';

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
    HttpClientModule,
    // feature modules
    AuthModule,
    NavOptionsModule,
    NotFoundModule,
    // shared modules
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    Store
  ],
  bootstrap: [
    AppComponent
  ]
  // exports: []
})

export class AppModule {}
