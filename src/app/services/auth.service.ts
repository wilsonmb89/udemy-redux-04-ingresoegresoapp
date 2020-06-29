import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/ngrx/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore
  ) { }

  public emitAuthListener(): void {
    this.angularFireAuth.authState.subscribe(
      firebaseUser => {
        if (!!firebaseUser) {
          this.userSubscription =
            this.angularFireStore.doc(`${firebaseUser.uid}/usuario`)
            .valueChanges()
            .subscribe(
              (firestoreUser: Usuario) => {
                this.store.dispatch(authActions.setUser({ user: firestoreUser }));
              }
            );
        } else {
          if (!!this.userSubscription) {
            this.userSubscription.unsubscribe();
          }
          this.store.dispatch(authActions.unSetUser());
        }
      }
    );
  }

  public registerFirebase(nombre: string, correo: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(correo, password)
              .then(fbUser => {
                const newUser = new Usuario(fbUser.user.uid, nombre, correo);
                return this.angularFireStore.doc(`${fbUser.user.uid}/usuario`).set({...newUser});
              });
  }

  public loginFirebase(correo: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(correo, password);
  }

  public logout(): Promise<void> {
    return this.angularFireAuth.signOut();
  }

  public isAuth() {
    return this.angularFireAuth.authState.pipe(
      map(firebaseUser => !!firebaseUser)
    );
  }
}
