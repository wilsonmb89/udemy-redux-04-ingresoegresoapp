import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as uiActions from 'src/app/shared/ngrx/ui.actions';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isLoading: boolean;
  storeUiSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.storeUiSubscription = this.store.select('ui').subscribe(
      ui => this.isLoading = ui.isLoading
    );
  }

  ngOnDestroy() {
    if (!!this.storeUiSubscription) {
      this.storeUiSubscription.unsubscribe();
    }
  }

  public register(): void {
    this.store.dispatch(uiActions.isLoading());
    const { nombre, correo, password } = this.registerForm.value;
    this.authService.registerFirebase(nombre, correo, password)
      .then(
        credential => {
          this.store.dispatch(uiActions.stopLoading());
          this.router.navigate(['/dashboard']);
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
