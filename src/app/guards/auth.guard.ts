import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2'
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentUser: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  canActivate() {
    if (this.userService.getLogged() && this.userService.getConfirmed()) {
      return true;
    } else if (this.userService.getLogged() == false && this.userService.getConfirmed() == false) {
      this.router.navigate(['/unconfirmed']);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
