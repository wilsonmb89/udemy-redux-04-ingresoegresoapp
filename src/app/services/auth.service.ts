import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore
  ) { }

  emitAuthListener() {
    this.angularFireAuth.authState.subscribe(
      firebaseUser => {
        console.log('firebaseUser:', firebaseUser);
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
