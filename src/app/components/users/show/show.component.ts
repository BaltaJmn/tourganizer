import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { IndexUserComponent } from '../index/index.component';

import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { ActivityService } from '../../../services/activity.service';

import { User } from '../../../interfaces/User';
import { Route } from '../../../interfaces/Route';
import { Activity } from '../../../interfaces/Activity';

import * as $ from "jquery";
import Swal from 'sweetalert2'
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../interfaces/Notification';
import { EditUserComponent } from '../edit/edit.component';

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

  //Languages Config
  languages = [
    { id: "es", name: "spanish" },
    { id: "en", name: "english" }
  ]
  config = {
    lang: null
  };

  currentUser: User = {
    id: null,
    profile: null,
    username: null,
    password: null,
    email: null,
    config: {
      confirmed: null,
      lang: null,
      rol: null
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  followers: User[];
  follows: User[];
  createdRoutes: Route[];
  savedRoutes: Route[];
  recentActivities: Activity[] = [];
  activities: Activity[] = [];
  notifications: Notification[] = [];

  loaded = false;

  constructor(
    private router: Router,
    public userService: UserService,
    public routeService: RouteService,
    public activityService: ActivityService,
    public notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });

    this.activatedRoute.params.subscribe(params => {
      this.userService.getUser(params.id).subscribe((result: any) => {

        this.followers = [];
        this.follows = [];
        this.createdRoutes = [];
        this.savedRoutes = [];
        this.activities = [];

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
        };

        this.config.lang = this.currentUser.config.lang;

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

          this.activityService.getActivityProfile(followID).subscribe((result: any) => {
            result.forEach(element => {
              let activityAux: Activity = {
                id: element.payload.doc.id,
                userId: element.payload.doc.data().profile,
                type: element.payload.doc.data().type,
                date: element.payload.doc.data().date,
                content: element.payload.doc.data().content,
                profile: element.payload.doc.data().profile,
                new: element.payload.doc.data().new
              };

              this.activities.push(activityAux)
            });
          });

        });

        this.currentUser.createdRoutes.forEach((route) => {
          this.routeService.getRouteSnapshot(route).subscribe((result: any) => {
            let routeAux: Route = {
              id: result.payload.id,
              userId: result.payload.data().userId,
              profile: result.payload.data().profile,
              name: result.payload.data().name,
              type: result.payload.data().usetyperId,
              confirmed: result.payload.data().confirmed,
              center: result.payload.data().center,
              totalTime: result.payload.data().totalTime,
              rating: result.payload.data().rating,
              localizations: result.payload.data().localizations,
            };
            this.createdRoutes.push(routeAux);
          });
        });

        this.currentUser.savedRoutes.forEach((route) => {
          this.routeService.getRouteSnapshot(route).subscribe((result: any) => {
            let routeAux: Route = {
              id: result.payload.id,
              userId: result.payload.data().userId,
              profile: result.payload.data().profile,
              name: result.payload.data().name,
              type: result.payload.data().usetyperId,
              confirmed: result.payload.data().confirmed,
              center: result.payload.data().center,
              totalTime: result.payload.data().totalTime,
              rating: result.payload.data().rating,
              localizations: result.payload.data().localizations,
            };
            this.savedRoutes.push(routeAux);
          });
        });

        this.notificationService.getNotificationsById(this.currentUser.id).subscribe((notificationSnapshot) => {

          notificationSnapshot.forEach((doc: any) => {

            let notificationAux: Notification = {
              id: doc.payload.doc.id,
              content: doc.payload.doc.data().content,
              sender: doc.payload.doc.data().sender,
              receiver: doc.payload.doc.data().receiver,
              seen: doc.payload.doc.data().seen,
              date: doc.payload.doc.data().date,
            };

            this.notifications.push(notificationAux);

          });
        });

        this.activityService.getActivityRecent(this.currentUser.id).subscribe((result: any) => {

          this.recentActivities = [];

          result.forEach(element => {

            let activityAux: Activity = {
              id: element.payload.doc.id,
              userId: element.payload.doc.data().profile,
              type: element.payload.doc.data().type,
              date: element.payload.doc.data().date,
              content: element.payload.doc.data().content,
              profile: element.payload.doc.data().profile,
              new: element.payload.doc.data().new
            };

            this.recentActivities.push(activityAux)
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

  removeActivity(index, activity) {
    this.activityService.updateProfileActivity(activity);
  };

  seeNoti(noti) {
    this.notificationService.updateNotificationSeen(noti);
  };

  removeNoti(index, noti) {
    this.notifications.splice(index, 1);
    this.notificationService.deleteNotification(noti);
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

  openModal() {
    const dialogRef = this.dialog.open(IndexUserComponent, {
      width: '800px',
      height: '600px'
    });
  };

  openEdit() {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      height: '625px',
      data: this.currentUser
    });
  }
}