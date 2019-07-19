import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// rxjs
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// store
import { Store } from '../../store/store';

// services
import { AuthService } from '../../modules/auth/shared/services/auth/auth.service';

// interfaces
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  subscription: Subscription;

  currentUrl: string = null;
  isAuthUrl = false;

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.auth$.subscribe();
    this.user$ = this.store.select<User>('user');
    this.onRouterChange();
  }

  onRouterChange(): void {
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd)
    ).subscribe( (navigationEnd: NavigationEnd) => {
      this.currentUrl = navigationEnd.url;
      this.isAuthUrl = this.currentUrl.includes('login') ? true : false || this.currentUrl.includes('register') ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // onBrowserNavigation() {
  //   // DO NOT REMOVE. This covers case where the browser back button is clicked from the home page.
  //   // the logout function also covers the authentication action from the store
  //   this.platformLocation.onPopState(() => {
  //     this.router.events.subscribe(event => {
  //       if (event instanceof NavigationEnd && event.url === '/login') {
  //         this.logout();
  //       }
  //     });
  //   });
  // }

  async onLogout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }

  onActivate(event: Router): void {
    // console.log('activate', event);
  }

  onDeactivate(event: Router): void {
    // console.log('deactivate', event);
  }

}

