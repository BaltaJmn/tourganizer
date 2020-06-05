import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';

import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditUserComponent implements OnInit {

  loaded = true;

  //Profile Variables
  n = Date.now();
  file;
  fileImages;
  filePath;
  fileRef;
  downloadURL;

  user = new FormGroup({
    profile: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    rol: new FormControl(0, [Validators.required]),
    config: new FormControl({}, [Validators.required]),
    followers: new FormControl([], [Validators.required]),
    follows: new FormControl([], [Validators.required]),
    createdRoutes: new FormControl([], [Validators.required]),
    savedRoutes: new FormControl([], [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public currentUser: User,
    public dialogRef: MatDialogRef<EditUserComponent>,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {

  }

  ngOnInit() {
    this.user.get("profile").setValue(this.currentUser.profile);
    this.user.get("username").setValue(this.currentUser.username);
    this.user.get("password").setValue(this.currentUser.password);
    this.user.get("email").setValue(this.currentUser.email);
    this.user.get("config").setValue(this.currentUser.config);
    this.user.get("followers").setValue(this.currentUser.followers);
    this.user.get("follows").setValue(this.currentUser.follows);
    this.user.get("createdRoutes").setValue(this.currentUser.createdRoutes);
    this.user.get("savedRoutes").setValue(this.currentUser.savedRoutes);
  };

  onSubmit(user: FormGroup) {

    if (this.file != null) {
      const task = this.storage.upload(`images/${this.n}`, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.storage = url;
              user.get("profile").setValue(this.storage);

              this.userService.updateUser(this.currentUser.id, user.value).then(() => {
                this._snackBar.open('Usuario actualizado', 'Ok', {
                  duration: 3000
                });
                this.dialogRef.close();
              });

            }
          });
        })
      ).subscribe(url => {
        if (url) { }
      });

    } else {
      this.userService.updateUser(this.currentUser.id, user.value).then(() => {
        this._snackBar.open('Usuario actualizado', 'Ok', {
          duration: 3000
        });
        this.dialogRef.close();
      });
    }
  };

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `images/${this.n}`;
    this.fileRef = this.storage.ref(this.filePath);
  };

}
