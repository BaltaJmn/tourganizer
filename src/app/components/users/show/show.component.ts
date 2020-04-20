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

  followers: User[];
  follows: User[];

  loaded = true;

  constructor(
    private router: Router,
    public userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userService.getUser(params.id).subscribe((result: any) => {

        this.followers = [];
        this.follows = [];

        this.currentUser = {
          id: result.payload.id,
          username: result.payload.data().username,
          password: result.payload.data().password,
          email: result.payload.data().email,
          confirmed: result.payload.data().confirmed,
          rol: result.payload.data().rol,
          followers: result.payload.data().followers,
          follows: result.payload.data().follows,
          createdRoutes: result.payload.data().createdRoutes,
          savedRoutes: result.payload.data().savedRoutes,
        }

        this.currentUser.followers.forEach((followerID) => {
          this.userService.getUser(followerID).subscribe((result: any) => {
            let followerAux: User = {
              id: result.payload.id,
              username: result.payload.data().username,
              password: result.payload.data().password,
              email: result.payload.data().email,
              confirmed: result.payload.data().confirmed,
              rol: result.payload.data().rol,
              followers: result.payload.data().followers,
              follows: result.payload.data().follows,
              createdRoutes: result.payload.data().createdRoutes,
              savedRoutes: result.payload.data().savedRoutes,
            };
            this.followers.push(followerAux)
          });
        });

        this.currentUser.follows.forEach((followID) => {
          this.userService.getUser(followID).subscribe((result: any) => {
            let followAux: User = {
              id: result.payload.id,
              username: result.payload.data().username,
              password: result.payload.data().password,
              email: result.payload.data().email,
              confirmed: result.payload.data().confirmed,
              rol: result.payload.data().rol,
              followers: result.payload.data().followers,
              follows: result.payload.data().follows,
              createdRoutes: result.payload.data().createdRoutes,
              savedRoutes: result.payload.data().savedRoutes,
            };
            this.follows.push(followAux)
          });
        });
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