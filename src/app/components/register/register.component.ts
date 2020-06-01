import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment.prod';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new FormGroup({
    profile: new FormControl(environment.urlDefaultIcon),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    config: new FormControl({}),
    followers: new FormControl([]),
    follows: new FormControl([]),
    createdRoutes: new FormControl([]),
    savedRoutes: new FormControl([]),
  });

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    this.user.get("config").setValue({ confirmed: false, lang: "es", rol: "2" });
    this.userService.register(user.value);
  }
}
