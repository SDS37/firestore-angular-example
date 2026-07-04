import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';

// store
import { Store } from 'src/app/store/store';

// utils
import {
  observeAuthState,
  registerUser,
  signInUser,
  signOutUser
} from 'src/app/utils/firebase-auth.utils';

// rxjs
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// interfaces
import { User as AppUser } from 'src/app/models/user.interface';

@Injectable()
export class AuthService {

  auth$: Observable<User | null> = observeAuthState(this.auth).pipe(
    tap((next: User | null) => {
      if (!next) {
        this.store.set('user', null);
        return;
      }
      const user: AppUser = {
        email: next.email,
        uid: next.uid,
        authenticated: true
      };
      this.store.set('user', user);
    })
  );

  constructor(
    private auth: Auth,
    private store: Store
  ) {}

  get user(): User | null {
    return this.auth.currentUser;
  }

  get authState(): Observable<User | null> {
    return observeAuthState(this.auth);
  }

  createUser(email: string, password: string) {
    return registerUser(this.auth, email, password);
  }

  loginUser(email: string, password: string) {
    return signInUser(this.auth, email, password);
  }

  logoutUser() {
    return signOutUser(this.auth);
  }

}
