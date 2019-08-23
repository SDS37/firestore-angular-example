import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// services
import { AuthService } from '../services/auth/auth.service';

// rxjs
import { map } from 'rxjs/operators';

// firebase
import { User } from 'firebase';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate() {
    return this.authService.authState.pipe (
      map( (user: User): boolean => {
          if (!user) {
            this.router.navigate(['/auth/login']);
          }
          // double bang
          return !!user;
      })
    );
  }

}
