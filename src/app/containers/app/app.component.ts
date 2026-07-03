import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

// interfaces
import { User } from 'src/app/models/user.interface';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<User | null>;
  private subscriptions = new Subscription();

  currentUrl: string = null;
  isAuthUrl = false;

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.authService.auth$.subscribe());
    this.user$ = this.store.select('user');
    this.onRouterChange();
  }

  onRouterChange(): void {
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((navigationEnd: NavigationEnd) => {
        this.currentUrl = navigationEnd.url;
        this.isAuthUrl = this.currentUrl.includes('login') || this.currentUrl.includes('register');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async onLogout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }

  onActivate(_event: unknown): void {}

  onDeactivate(_event: unknown): void {}

}
