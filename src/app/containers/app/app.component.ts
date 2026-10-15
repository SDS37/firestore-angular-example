import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../components/app/app-header/app-header.component';
import { AppNavComponent } from '../../components/app/app-nav/app-nav.component';

// rxjs
import { filter, map } from 'rxjs/operators';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [NgClass, RouterOutlet, AppHeaderComponent, AppNavComponent],
  templateUrl: './app.component.html'
})

export class AppComponent {
  private router = inject(Router);
  private store = inject(Store);
  private authService = inject(AuthService);

  readonly user = toSignal(this.store.select('user'), { requireSync: true });

  constructor() {
    toSignal(this.authService.auth$);
  }
  private readonly navigationUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.url)
    ),
    { initialValue: this.router.url ?? '' }
  );
  readonly isAuthUrl = computed(() => {
    const url = this.navigationUrl();
    return url.includes('login') || url.includes('register');
  });

  async onLogout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }

  onActivate(_event: unknown): void {}

  onDeactivate(_event: unknown): void {}

}
