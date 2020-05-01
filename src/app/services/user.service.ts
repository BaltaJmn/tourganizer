import { Injectable, Output } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../interfaces/User';

import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { EmailService } from './email.service';
import { ActivityService } from './activity.service';
import { CookieService } from 'ngx-cookie-service';

import Swal from 'sweetalert2'

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
      rol: 3
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  private logged: boolean = false;
  private confirmed: boolean = false;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private emailService: EmailService,
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

  getUserByName(data) {
    return this.db.collection('user', ref => ref.where('username', '==', data)).get();
  }

  createUser(data) {
    return this.db.collection("user").add(data);
  };

  updateUser(id, data) {
    return this.db.collection("user")
      .doc(id)
      .set(data, { merge: true });
  };

  deleteUser(data) {
    return this.db.collection("user")
      .doc(data)
      .delete()
  }

  register(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.username).where('email', '==', data.email)).get().subscribe((result) => {
      if (result.empty) {
        this.db.collection("user").add(data).then(() => {

          this.getUserByName(data.username).subscribe((result: any) => {

            console.log(result[0].payload.doc.data());

            let userAux = {
              id: result[0].payload.doc.id,
              profile: result[0].payload.doc.data().profile,
              username: result[0].payload.doc.data().username,
              password: result[0].payload.doc.data().password,
              email: result[0].payload.doc.data().email,
              config: result[0].payload.doc.data().config,
              followers: result[0].payload.doc.data().followers,
              follows: result[0].payload.doc.data().follows,
              createdRoutes: result[0].payload.doc.data().createdRoutes,
              savedRoutes: result[0].payload.doc.data().savedRoutes,
            };

            this.emailService.sendEmail("https://enigmatic-hamlet-67391.herokuapp.com/email/register", userAux).subscribe((res) => {
              let resAux: any = res;
              console.log(resAux);
            });
          })
        });

        Swal.fire(
          'Succesfully Registered!',
          'You have been succesfully registered!',
          'success'
        );
      } else {
        Swal.fire(
          'Error!',
          'Your username is already taken!',
          'error'
        );
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

        this.loggedEmitter.emit(this.logged);
        this.userEmitter.emit(this.currentUser);
        this.notificationUSEmitter.emit("notification");

        this.cookieService.set('login', this.currentUser.username);

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

    this.cookieService.delete('login');

    this.logged = false;
    this.confirmed = false;

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

  confirmUser(id) {
    this.getUser(id).subscribe((user: any) => {
      let configAux = user.payload.data().config;
      configAux.confirmed = true;

      return this.db.collection("user")
        .doc(id)
        .set({ config: configAux }, { merge: true });
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

  getConfirmed() {
    return this.confirmed;
  }
}
