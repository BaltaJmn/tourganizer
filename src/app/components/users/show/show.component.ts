import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowUserComponent implements OnInit {

  currentUser: User = {
    id: null,
    username: null,
    password: null,
    email: null,
    confirmed: null,
    rol: null,
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  loaded = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userService.getUser(params.id).subscribe((result) => {

        this.currentUser = {
          id: result.id,
          username: result.data().username,
          password: result.data().password,
          email: result.data().email,
          confirmed: result.data().confirmed,
          rol: result.data().rol,
          followers: result.data().followers,
          follows: result.data().follows,
          createdRoutes: result.data().createdRoutes,
          savedRoutes: result.data().savedRoutes,
        }

        this.loaded = true;
      });
    });
  };

  deleteUser(id) {
    Swal.fire({
      title: 'Do you want to delete this localization?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        this.userService.deleteUser(id).then(() => {
          Swal.fire(
            'Deleted!',
            'This user was deleted succesfully!',
            'success'
          );
          this.router.navigate(['/users'])
        });
      }
    })
  };
}