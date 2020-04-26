import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';

import * as $ from "jquery";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowUserComponent implements OnInit {

  //Profile Variables
  n = Date.now();
  file;
  filePath;
  fileRef;
  downloadURL;

  currentUser: User = {
    id: null,
    profile: null,
    username: null,
    password: null,
    email: null,
    config: null,
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
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {

    $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });

    this.activatedRoute.params.subscribe(params => {
      this.userService.getUser(params.id).subscribe((result: any) => {

        this.followers = [];
        this.follows = [];

        this.currentUser = {
          id: result.payload.id,
          profile: result.payload.data().profile,
          username: result.payload.data().username,
          password: result.payload.data().password,
          email: result.payload.data().email,
          config: result.payload.data().config,
          followers: result.payload.data().followers,
          follows: result.payload.data().follows,
          createdRoutes: result.payload.data().createdRoutes,
          savedRoutes: result.payload.data().savedRoutes,
        }

        this.currentUser.followers.forEach((followerID) => {
          this.userService.getUser(followerID).subscribe((result: any) => {
            let followerAux: User = {
              id: result.payload.id,
              profile: result.payload.data().profile,
              username: result.payload.data().username,
              password: result.payload.data().password,
              email: result.payload.data().email,
              config: result.payload.data().config,
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
              profile: result.payload.data().profile,
              username: result.payload.data().username,
              password: result.payload.data().password,
              email: result.payload.data().email,
              config: result.payload.data().config,
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

  onFileSelected(event) {
    Swal.fire({

      title: 'Do you want to change you profile photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel',
      focusCancel: true,

    }).then((result) => {
      if (result.value) {

        var n = Date.now();
        const file = event.target.files[0];
        const filePath = `images/${n}`;
        const fileRef = this.storage.ref(filePath);

        const task = this.storage.upload(`images/${n}`, file);

        task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.storage = url;
                
                console.log(this.storage);

                this.userService.updateProfilePhoto(this.storage);
              }
            });
          })
          
        ).subscribe(url => {
          if (url) { }
        });
      }
    })
  };
}