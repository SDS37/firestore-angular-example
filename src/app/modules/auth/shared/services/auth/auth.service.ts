import { EnvironmentInjector, inject, runInInjectionContext, Service } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';

// store
import { Store } from 'src/app/store/store';

// utils
import {
  observeAuthState,
  registerUser,
  sendPasswordReset as requestPasswordReset,
  signInUser,
  signOutUser
} from 'src/app/utils/firebase-auth.utils';

// rxjs
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// interfaces
import { User as AppUser } from 'src/app/models/user.interface';

@Service()
export class AuthService {
  private auth = inject(Auth);
  private store = inject(Store);


  private readonly environmentInjector = inject(EnvironmentInjector);

  auth$: Observable<User | null> = observeAuthState(this.auth).pipe(
    tap((next: User | null) => {
      if (!next) {
        this.store.reset();
        return;
      }
      const user: AppUser = {
        email: next.email ?? '',
        uid: next.uid,
        authenticated: true
      };
      this.store.set('user', user);
    })
  );

  get user(): User | null {
    return this.auth.currentUser;
  }

  get authState(): Observable<User | null> {
    return observeAuthState(this.auth);
  }

  createUser(email: string, password: string) {
    return runInInjectionContext(this.environmentInjector, () => registerUser(this.auth, email, password));
  }

  loginUser(email: string, password: string) {
    return runInInjectionContext(this.environmentInjector, () => signInUser(this.auth, email, password));
  }

  logoutUser() {
    return runInInjectionContext(this.environmentInjector, () => signOutUser(this.auth));
  }

  sendPasswordReset(email: string) {
    return runInInjectionContext(this.environmentInjector, () => requestPasswordReset(this.auth, email));
  }

}
