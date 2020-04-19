import { Injectable, Output } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../interfaces/User';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() loggedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() userEmitter: EventEmitter<any> = new EventEmitter();
  @Output() notificationUSEmitter: EventEmitter<any> = new EventEmitter();

  private currentUser: User;
  private logged: boolean = false;

  constructor(
    private db: AngularFirestore,
    private emailService: EmailService,
    private router: Router) { }

  getUsers() {
    return this.db.collection('user', ref => ref.orderBy('username', 'desc')).snapshotChanges();
  }

  getUser(data) {
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

  deleteUser(data) {
    return this.db.collection("user")
      .doc(data)
      .delete()
  }

  register(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.email).where('password', '==', data.password)).get().subscribe((result) => {
      if (result.empty) {
        this.db.collection("user").add(data);

        this.emailService.sendEmail();

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
        )
      }
    });
  };

  login(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.username).where('password', '==', data.password)).get().subscribe((result) => {
      if (result.empty == false) {

        this.currentUser = {
          id: result.docs[0].id,
          username: result.docs[0].data().username,
          password: result.docs[0].data().password,
          email: result.docs[0].data().email,
          confirmed: result.docs[0].data().confirmed,
          rol: result.docs[0].data().rol,
          followers: result.docs[0].data().followers,
          follows: result.docs[0].data().follows,
          createdRoutes: result.docs[0].data().createdRoutes,
          savedRoutes: result.docs[0].data().savedRoutes,
        }

        this.logged = true;

        this.loggedEmitter.emit(this.logged);
        this.userEmitter.emit(this.currentUser);
        this.notificationUSEmitter.emit("notification");

        this.router.navigate(['/home']);

        Swal.fire(
          'Succesfully Logged!',
          'You have been succesfully logged!',
          'success'
        )
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
      username: null,
      password: null,
      email: null,
      confirmed: null,
      rol: null,
      followers: null,
      follows: null,
      createdRoutes: null,
      savedRoutes: null,
    };

    this.logged = false;

    this.loggedEmitter.emit(this.logged);
    this.userEmitter.emit(this.currentUser);
    this.router.navigate(['/home']);
  }

  follow(id) {

    this.currentUser.follows.push(id);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ follows: this.currentUser.follows }, { merge: true });
  }

  unfollow(id) {
    this.currentUser.follows.splice(this.currentUser.follows.indexOf(id), 1);

    return this.db.collection("user")
      .doc(this.currentUser.id)
      .set({ follows: this.currentUser.follows }, { merge: true });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUserId() {
    return this.currentUser.id;
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

  getCurrentUserConfirmed() {
    return this.currentUser.confirmed;
  }

  getCurrentUserRol() {
    return this.currentUser.rol;
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
}
