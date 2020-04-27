import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
    ) { }

  canActivate() {
    if(this.userService.getLogged()){
      return true;
    } else {
      this.router.navigate(['/login']);

      Swal.fire(
        'Error!',
        'Your user must be confirmed!',
        'error'
      );

      return false;
    }
  }

}
