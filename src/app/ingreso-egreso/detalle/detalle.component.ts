import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import * as uiActions from 'src/app/shared/ngrx/ui.actions';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresoEgresosSubscription: Subscription;
  usuario: Usuario;
  usuarioSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.ingresoEgresosSubscription =
      this.store.select('ingresoEgresos').subscribe(ingresoEgresos => this.ingresosEgresos = [...ingresoEgresos.items]);
    this.usuarioSubscription =
      this.store.select('userData').subscribe(userData => this.usuario = userData.user);
  }

  ngOnDestroy(): void {
    if (!!this.ingresoEgresosSubscription) {
      this.ingresoEgresosSubscription.unsubscribe();
    }
  }

  public deleteItem(item: IngresoEgreso): void {
    this.store.dispatch(uiActions.isLoading());
    this.ingresoEgresoService.deleteIngresoEgreso(this.usuario.userId, item.uid)
      .then(
        () => {
          this.store.dispatch(uiActions.stopLoading());
          this.modalService.showSuccessModal('Registro eliminado', item.descripcion);
        }
      )
      .catch(
        err => {
          this.store.dispatch(uiActions.stopLoading());
          this.modalService.showErrorModal('Oops...', err.message);
        }
      );
  }

}
