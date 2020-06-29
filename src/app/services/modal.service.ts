import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

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
