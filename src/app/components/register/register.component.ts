import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    confirmed: new FormControl(false),
    createdRoutes: new FormControl([]),
    savedRoutes: new FormControl([]),
    followers: new FormControl([]),
    follows: new FormControl([]),
    rol: new FormControl(3),
  });

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    console.log(user.value);
    this.userService.register(user.value);
  }
}
