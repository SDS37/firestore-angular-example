import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User } from '@angular/fire/auth';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

// rxjs
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate() {
    return this.authService.authState.pipe(
      take(1),
      map((user: User | null): boolean => {
        if (!user) {
          this.router.navigate(['/auth/login']);
        }
        return !!user;
      })
    );
  }

}
