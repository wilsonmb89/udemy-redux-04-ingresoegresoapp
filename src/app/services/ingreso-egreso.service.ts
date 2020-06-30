import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  public addIngresoEgreso(entry: IngresoEgreso, userId: string): Promise<DocumentReference> {
    delete entry.uid;
    return this.angularFirestore.doc(`${userId}/ingresos-egresos`)
      .collection('items').add({...entry});
  }

  public initIngresoEgresosListener(userId: string): Observable<any[]> {
    return this.angularFirestore
      .collection(`${userId}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(
          snapshot => snapshot.map(doc => ({
                uid: doc.payload.doc.id,
                ...doc.payload.doc.data() as any
              })
            )
        )
      );
  }

  public deleteIngresoEgreso(uidUser: string, uidItem: string): Promise<void> {
    return this.angularFirestore.doc(`${uidUser}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
