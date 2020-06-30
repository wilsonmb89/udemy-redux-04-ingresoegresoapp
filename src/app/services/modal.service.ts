import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private store: Store<AppState>
  ) {
    this.store.select('ui').subscribe(
      ui => {
        if (ui.isLoading) {
          this.showLoadingModal();
        } else {
          this.closeModal();
        }
      }
    );
  }

  public showSuccessModal(title?: string, message?: string): void {
    Swal.fire({
      icon: 'success',
      title: title || 'Exito!',
      text: message || 'Operación realizada satisfactoriamente'
    });
  }

  public showErrorModal(title?: string, message?: string): void {
    Swal.fire({
      icon: 'error',
      title: title || 'Oops...',
      text: message || 'Ha ocurrido un error'
    });
  }

  public showLoadingModal(): void {
    Swal.fire({
      title: 'Por favor espere...',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }

  public closeModal(): void {
    Swal.close();
  }
}
