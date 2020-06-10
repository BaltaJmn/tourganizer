import { Injectable, Output } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../interfaces/User';
import { Notification } from '../interfaces/Notification';

import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { EmailService } from './email.service';
import { ActivityService } from './activity.service';
import { NotificationService } from './notification.service';
import { CookieService } from 'ngx-cookie-service';

import Swal from 'sweetalert2'
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() loggedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() userEmitter: EventEmitter<any> = new EventEmitter();
  @Output() notificationUSEmitter: EventEmitter<any> = new EventEmitter();

  private currentUser: User = {
    id: "",
    profile: "",
    username: "",
    password: "",
    email: "",
    config: {
      lang: "",
      confirmed: false,
      rol: 2
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  private logged: boolean = false;
  private admin: boolean = false;
  private moderator: boolean = false;
  private confirmed: boolean = false;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private _snackBar: MatSnackBar,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private activityService: ActivityService,
    private cookieService: CookieService,
    private translate: TranslateService,
    private router: Router) { }

  getUsers() {
    return this.db.collection('user', ref => ref.orderBy('username', 'desc')).snapshotChanges();
  }

  getUser(data) {
    return this.db.collection('user').doc(data).snapshotChanges();
  }

  getUserGET(data) {
    return this.db.collection('user').doc(data).get();
  }

  getUserByName(data) {
    return this.db.collection('user', ref => ref.where('username', '==', data)).get();
  }

  getNameById(data) {
    return this.db.collection('user').doc(data).get();
  }

  createUser(data) {
    return this.db.collection("user").add(data);
  };

  updateUser(id, data) {
    return this.db.collection("user")
      .doc(id)
      .set(data, { merge: true });
  };

  updateCreatedRoutes(id, data) {
    this.currentUser.createdRoutes = data;

    return this.db.collection("user")
      .doc(id)
      .set({ createdRoutes: this.currentUser.createdRoutes }, { merge: true });
  };

  updateSavedRoutes(id, data) {
    this.currentUser.savedRoutes = data;

    return this.db.collection("user")
      .doc(id)
      .set({ savedRoutes: this.currentUser.savedRoutes }, { merge: true });
  };

  deleteUser(data) {
    return this.db.collection("user")
      .doc(data)
      .delete()
  };

  register(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.username).where('email', '==', data.email)).get().subscribe((result) => {
      if (result.empty) {
        this.db.collection("user").add(data).then(() => {

          this.getUserByName(data.username).subscribe((result) => {

            let userAux = {
              id: result.docs[0].id,
              profile: result.docs[0].data().profile,
              username: result.docs[0].data().username,
              password: result.docs[0].data().password,
              email: result.docs[0].data().email,
              config: result.docs[0].data().config,
              followers: result.docs[0].data().followers,
              follows: result.docs[0].data().follows,
              createdRoutes: result.docs[0].data().createdRoutes,
              savedRoutes: result.docs[0].data().savedRoutes,
            };

            this.emailService.sendEmail("https://enigmatic-hamlet-67391.herokuapp.com/email/register", userAux).subscribe((res) => {
              let resAux: any = res;
            });
          })
        });

        this._snackBar.open('Usuario creado. Confirme la cuenta en su correo', 'Ok', {
          duration: 3000
        });

      } else {
        this._snackBar.open('Ese usuario está en uso', 'Ok', {
          duration: 3000
        });
      }
    });
  };

  login(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.username).where('password', '==', data.password)).get().subscribe((result) => {
      if (result.empty == false) {

        this.currentUser = {
          id: result.docs[0].id,
          profile: result.docs[0].data().profile,
          username: result.docs[0].data().username,
          password: result.docs[0].data().password,
          email: result.docs[0].data().email,
          config: result.docs[0].data().config,
          followers: result.docs[0].data().followers,
          follows: result.docs[0].data().follows,
          createdRoutes: result.docs[0].data().createdRoutes,
          savedRoutes: result.docs[0].data().savedRoutes,
        }

        this.logged = true;
        this.confirmed = this.currentUser.config.confirmed;

        if (this.currentUser.config.rol == 0) {
          this.admin = true;
        }

        if (this.currentUser.config.rol == 1) {
          this.moderator = true;
        }

        this.loggedEmitter.emit(this.logged);
        this.userEmitter.emit(this.currentUser);

        if (this.cookieService.get('login') != null) {
          this.cookieService.delete('login');
          this.cookieService.set('login', this.currentUser.username);
        }

        // this.notificationService.getNotificationsById(this.currentUser.id).subscribe((notificationSnapshot) => {

        //   let arrayNotifications = [];

        //   notificationSnapshot.forEach((doc: any) => {

        //     let notificationAux: Notification = {
        //       id: doc.payload.doc.id,
        //       content: doc.payload.doc.data().content,
        //       sender: doc.payload.doc.data().sender,
        //       receiver: doc.payload.doc.data().receiver
        //     };

        //     arrayNotifications.push(notificationAux);

        //   });

        //   this.notificationUSEmitter.emit(arrayNotifications);
        //   
        // });

        this.router.navigate(['/home']);

      } else {
        Swal.fire(
          'Error!',
          'Your username or password is incorrect!',
          'error'
        )
      }
    })
  }

  logOut() {
    this.currentUser = {
      id: null,
      profile: null,
      username: null,
      password: null,
      email: null,
      config: null,
      followers: null,
      follows: null,
      createdRoutes: null,
      savedRoutes: null,
    };

    this.cookieService.deleteAll();

    this.logged = false;
    this.confirmed = false;
    this.admin = false;
    this.moderator = false;

    this.loggedEmitter.emit(this.logged);
    this.userEmitter.emit(this.currentUser);

    this.router.navigate(['/']);
  }

  follow(data) {

    this.currentUser.follows.push(data.id);

    this.activityService.createActivityFollow(1, this.currentUser, data);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ follows: this.currentUser.follows }, { merge: true });
  }

  unfollow(data) {
    this.currentUser.follows.splice(this.currentUser.follows.indexOf(data.id), 1);

    this.activityService.createActivityFollow(2, this.currentUser, data);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ follows: this.currentUser.follows }, { merge: true });
  }

  save(data) {
    this.currentUser.savedRoutes.push(data.id);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ savedRoutes: this.currentUser.savedRoutes }, { merge: true });
  }

  unsave(data) {
    this.currentUser.savedRoutes.splice(this.currentUser.savedRoutes.indexOf(data.id), 1);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ savedRoutes: this.currentUser.savedRoutes }, { merge: true });
  }

  addCreatedRoute(data) {
    this.currentUser.createdRoutes.push(data);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ createdRoutes: this.currentUser.createdRoutes }, { merge: true });
  }

  removeCreatedRoute(data) {
    if (this.currentUser.createdRoutes.indexOf(data.id) != (-1)) {
      this.currentUser.createdRoutes.splice(this.currentUser.createdRoutes.indexOf(data.id), 1);

      return this.db.collection("user")
        .doc(this.currentUser.id)
        .set({ createdRoutes: this.currentUser.createdRoutes }, { merge: true });
    }
  }

  searchSavedRoutes(id) {
    this.getUsers().subscribe((users) => {
      users.forEach((user: any) => {
        let routesAux = user.payload.doc.data().savedRoutes
        if (routesAux.indexOf(id) != (-1)) {
          routesAux.splice(routesAux.indexOf(id), 1);

          this.updateSavedRoutes(user.payload.doc.id, routesAux)
        }
      })
    })
  }

  confirmUser(id) {
    this.getUser(id).subscribe((user: any) => {
      let configAux = user.payload.data().config;
      configAux.confirmed = true;

      return this.db.collection("user")
        .doc(id)
        .set({ config: configAux }, { merge: true });
    });
  }

  searchUser(email) {
    return this.db.collection("user", ref => ref.where('email', '==', email)).get().subscribe((user: any) => {

      let userAux: User = {
        id: user.docs[0].id,
        profile: user.docs[0].data().profile,
        username: user.docs[0].data().username,
        password: user.docs[0].data().password,
        email: user.docs[0].data().email,
        config: user.docs[0].data().config,
        followers: user.docs[0].data().followers,
        follows: user.docs[0].data().follows,
        createdRoutes: user.docs[0].data().createdRoutes,
        savedRoutes: user.docs[0].data().savedRoutes,
      };

      this.emailService.sendEmail("https://enigmatic-hamlet-67391.herokuapp.com/email/reset", userAux).subscribe((res) => {

      });

    })
  }

  resetPassword(id) {
    this.getUserGET(id).subscribe((user) => {
      let newPassword = Math.random().toString(36).slice(-8);

      let userAux = {
        id: user.id,
        profile: user.data().profile,
        username: user.data().username,
        password: newPassword,
        email: user.data().email,
        config: user.data().config,
        followers: user.data().followers,
        follows: user.data().follows,
        createdRoutes: user.data().createdRoutes,
        savedRoutes: user.data().savedRoutes,
      };

      this.db.collection("user")
        .doc(id)
        .set({ password: newPassword }, { merge: true });

      this.emailService.sendEmail("https://enigmatic-hamlet-67391.herokuapp.com/email/password", userAux).subscribe(() => { });
    });
  }

  updateProfilePhoto(data) {
    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ profile: data }, { merge: true });
  }

  saveConfig(data) {

    let configAux = this.currentUser.config;

    configAux.lang = data.lang;

    this.translate.setDefaultLang(data.lang);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ config: configAux }, { merge: true });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUserId() {
    return this.currentUser.id;
  }

  getCurrentUserProfile() {
    return this.currentUser.profile;
  }

  getCurrentUserName() {
    return this.currentUser.username;
  }

  getCurrentUserPassword() {
    return this.currentUser.password;
  }

  getCurrentUserEmail() {
    return this.currentUser.email;
  }

  getCurrentUserConfig() {
    return this.currentUser.config;
  }

  getCurrentUserFollowers() {
    return this.currentUser.followers;
  }

  getCurrentUserFollows() {
    return this.currentUser.follows;
  }

  getCurrentUserCreatedRoutes() {
    return this.currentUser.createdRoutes;
  }

  getCurrentUserSavedRoutes() {
    return this.currentUser.savedRoutes;
  }

  getLogged() {
    return this.logged;
  }

  getAdmin() {
    return this.admin;
  }

  getModerator() {
    return this.moderator;
  }

  getConfirmed() {
    return this.confirmed;
  }
}
