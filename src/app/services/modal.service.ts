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

  showErrorModal(title?: string, message?: string) {
    Swal.fire({
      icon: 'error',
      title: title || 'Oops...',
      text: message || 'Ha ocurrido un error'
    });
  }

  showLoadingModal(): void {
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
