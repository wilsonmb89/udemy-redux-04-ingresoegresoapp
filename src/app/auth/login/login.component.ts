import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as uiActions from 'src/app/shared/ngrx/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
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
    this.loginForm = this.formBuilder.group({
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

  public login(): void {
    this.store.dispatch(uiActions.isLoading());
    // this.modalService.showLoadingModal();
    const { correo, password } = this.loginForm.value;
    this.authService.loginFirebase(correo, password)
      .then(
        credential => {
          console.log('Credential:', credential);
          this.store.dispatch(uiActions.stopLoading());
          // this.modalService.closeModal();
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
