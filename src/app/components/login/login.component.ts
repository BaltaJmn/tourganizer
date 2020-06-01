import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  email = '';

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onSubmit(user: FormGroup) {
    this.userService.login(user.value);
  }

  openModal() {
    const dialogRef = this.dialog.open(ResetPasswordForm, {
      width: '250px',
      data: { email: this.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
      this.userService.searchUser(this.email);
    });
  }

}

@Component({
  selector: 'reset-password-form',
  templateUrl: 'reset-form.html',
})
export class ResetPasswordForm {

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordForm>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}