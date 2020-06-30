import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { setItems } from '../ingreso-egreso/ngrx/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userDataSubscription: Subscription;
  ingresoEgresoSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userDataSubscription =
      this.store.select('userData')
      .pipe(
        filter(userData => !!userData.user)
      )
      .subscribe(
        userData => {
          this.ingresoEgresoSubscription =
            this.ingresoEgresoService.initIngresoEgresosListener(userData.user.userId)
            .subscribe(
              firebaseItems => {
                this.store.dispatch(setItems({ items: firebaseItems }));
              }
            );
        }
      );
  }

  ngOnDestroy() {
    if (!!this.ingresoEgresoSubscription) {
      this.ingresoEgresoSubscription.unsubscribe();
    }
    if (!!this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

}
