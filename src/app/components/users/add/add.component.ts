import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { UserService } from '../../../services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddUserComponent implements OnInit {

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
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    this.userService.createUser(user.value).then(() => {
      Swal.fire('Great!', 'Your user was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/users']);
      });
    });
  };

}
