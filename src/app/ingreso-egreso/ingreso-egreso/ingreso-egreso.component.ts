import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ModalService } from 'src/app/services/modal.service';
import * as uiActions from 'src/app/shared/ngrx/ui.actions';
import { addItem } from '../ngrx/ingreso-egreso.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  addEntryForm: FormGroup;
  usuario: Usuario;
  usuarioSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.addEntryForm = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      monto: [null, [Validators.required, Validators.min(1)]],
      tipo: ['ingreso', [Validators.required]]
    });
    this.usuarioSubscription =
      this.store.select('userData').subscribe(userData => this.usuario = userData.user);
  }

  ngOnDestroy() {
    if (!!this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  public addEntry(): void {
    if (this.addEntryForm.valid && !!this.usuario) {
      this.store.dispatch(uiActions.isLoading());
      const { descripcion, monto, tipo } = this.addEntryForm.value;
      const entry = new IngresoEgreso(descripcion, monto, tipo);
      this.ingresoEgresoService.addIngresoEgreso(entry, this.usuario.userId)
        .then(
          documentReference => {
            this.store.dispatch(addItem({ item: entry }));
            this.store.dispatch(uiActions.stopLoading());
            this.modalService.showSuccessModal('Registro creado', this.addEntryForm.get('descripcion').value);
            this.addEntryForm.reset();
            this.addEntryForm.get('tipo').setValue('ingreso');
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

  public toogleEntryType(): void {
    this.addEntryForm.get('tipo')
      .setValue(this.addEntryForm.get('tipo').value === 'ingreso' ? 'egreso' : 'ingreso');
  }
}
