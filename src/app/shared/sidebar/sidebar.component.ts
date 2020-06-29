import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
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
