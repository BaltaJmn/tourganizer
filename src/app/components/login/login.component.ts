import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new FormGroup({
    username: new FormControl('asd', [Validators.required]),
    password: new FormControl('asdasdasd', [Validators.required])
  });

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    this.userService.getUser(user.value);
  }

}
