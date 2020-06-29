import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
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
  }

  public login(): void {
    this.modalService.showLoadingModal();
    const { correo, password } = this.loginForm.value;
    this.authService.loginFirebase(correo, password)
      .then(
        credential => {
          console.log('Credential:', credential);
          this.modalService.closeModal();
          this.router.navigate(['/dashboard']);
        }
      )
      .catch(
        err => {
          this.modalService.showErrorModal('Oops...', err.message);
        }
      );
  }

}
