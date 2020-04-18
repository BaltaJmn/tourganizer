import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditUserComponent implements OnInit {

  loaded = true;
  currentUser: User;

  id;

  user = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    rol: new FormControl(0, [Validators.required]),
    confirmed: new FormControl(false, [Validators.required]),
    followers: new FormControl([], [Validators.required]),
    follows: new FormControl([], [Validators.required]),
    createdRoutes: new FormControl([], [Validators.required]),
    savedRoutes: new FormControl([], [Validators.required]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.id = event.url.split('/')[2]
      };
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {

      this.loaded = false;

      this.userService.getUser(this.id).subscribe((result) => {

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

        this.user.get("username").setValue(this.currentUser.username);
        this.user.get("password").setValue(this.currentUser.password);
        this.user.get("email").setValue(this.currentUser.email);
        this.user.get("confirmed").setValue(this.currentUser.confirmed);
        this.user.get("rol").setValue(this.currentUser.rol);
        this.user.get("followers").setValue(this.currentUser.followers);
        this.user.get("follows").setValue(this.currentUser.follows);
        this.user.get("createdRoutes").setValue(this.currentUser.createdRoutes);
        this.user.get("savedRoutes").setValue(this.currentUser.savedRoutes);

        this.loaded = true;
      });
    });
  };

  onSubmit(user: FormGroup) {
    this.userService.updateUser(this.id, user.value).then(() => {
      Swal.fire('Great!', 'Your user was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/users']);
      });
    });
  };

}
