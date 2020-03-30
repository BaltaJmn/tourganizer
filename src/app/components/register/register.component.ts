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
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
  });

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    this.userService.insertUser(user.value).then(function () {
      Swal.fire(
        'Succesfully Registered!',
        'You have been succesfully registered!',
        'success'
      )
    });
  }

}
