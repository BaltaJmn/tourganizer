import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';

import { UserService } from '../../../services/user.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddUserComponent implements OnInit {

  //Profile Variables
  n = Date.now();
  file;
  filePath;
  fileRef;
  downloadURL;

  user = new FormGroup({
    profile: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    config: new FormControl({ confirmed: false, lang: "es", rol: 0 }),
    followers: new FormControl([]),
    follows: new FormControl([]),
    createdRoutes: new FormControl([]),
    savedRoutes: new FormControl([]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() { }

  onSubmit(user: FormGroup) {
    const task = this.storage.upload(`images/${this.n}`, this.file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.storage = url;

            this.user.get("profile").setValue(this.storage);

            this.userService.createUser(user.value).then(() => {
              Swal.fire('Great!', 'Your user was updated succesfully!', 'success').then(() => {
                this.router.navigate(['/users']);
              });
            });

          }
        });
      })
    ).subscribe(url => {
      if (url) {
        console.log(`La url 2 ${url.downloadURL}`);
      }
    });
  };

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `images/${this.n}`;
    this.fileRef = this.storage.ref(this.filePath);
  }
}
