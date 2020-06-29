import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
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
  }

  public register(): void {
    this.modalService.showLoadingModal();
    const { nombre, correo, password } = this.registerForm.value;
    this.authService.registerFirebase(nombre, correo, password)
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
