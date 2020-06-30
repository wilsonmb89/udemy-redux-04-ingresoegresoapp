import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  usuarioName: string;
  usuarioSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.usuarioName = '';
    this.usuarioSubscription =
      this.store.select('userData')
      .pipe(
        filter(userData => !!userData.user)
      )
      .subscribe(userData => this.usuarioName = userData.user.nombre);
  }

  ngOnDestroy(): void {
    if (!!this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  public logout(): void {
    this.modalService.showLoadingModal();
    this.authService.logout()
      .then(
        () => {
          this.modalService.closeModal();
          this.router.navigate(['/login']);
        }
      );
  }
}
