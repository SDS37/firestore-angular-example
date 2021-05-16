import { Injectable } from '@angular/core';

// third-party firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInfo } from 'firebase';

// store
import { Store } from 'src/app/store/store';

// rxjs
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// interfaces
import { User } from 'src/app/models/user.interface';

@Injectable()
export class AuthService {

  auth$: Observable<firebase.User> = this.af.authState.pipe(
    tap( ( next: firebase.User ) => {
      if (!next) {
        this.store.set('user', null);
        return;
      }
      const user: User = {
        email: next.email,
        uid: next.uid,
        authenticated: true
      };
      this.store.set('user', user);
    })
  );

  constructor(
    private af: AngularFireAuth,
    private store: Store
  ) {}

  get user(): UserInfo {
    return this.af.auth.currentUser;
  }

  get authState(): Observable<firebase.User> {
    return this.af.authState;
  }

  createUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<void> {
    return this.af.auth.signOut();
  }

}
