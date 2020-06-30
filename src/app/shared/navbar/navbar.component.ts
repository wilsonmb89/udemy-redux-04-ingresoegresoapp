import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Usuario } from 'src/app/models/usuario.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuarioName: string;
  usuarioSubscription: Subscription;

  constructor(
    private store: Store<AppState>
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

}
