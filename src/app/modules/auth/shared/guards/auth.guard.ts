import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'src/app/utils/firebase-auth.utils';

// rxjs
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return new Observable<boolean | UrlTree>(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        observer.next(
          user ? true : this.router.createUrlTree(['/auth/login'])
        );
        observer.complete();
      }, error => observer.error(error));

      return () => unsubscribe();
    });
  }

}
