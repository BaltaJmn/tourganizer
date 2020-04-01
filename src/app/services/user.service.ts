import { Injectable, Output } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../interfaces/User';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() loggedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() userEmitter: EventEmitter<any> = new EventEmitter();

  private currentUser: User;
  private logged: boolean = false;

  constructor(
    private db: AngularFirestore,
    private router: Router) { }

  getUsers() {
    return this.db.collection("user").get();
  }

  getUser(data) {
    return this.db.collection("user", ref => ref.where('username', '==', data.username).where('password', '==', data.password)).get().subscribe((result) => {
      if (result.empty == false) {
        this.currentUser = {
          id: result.docs[0].id,
          username: result.docs[0].data().username,
          password: result.docs[0].data().password,
          routes: result.docs[0].data().routes,
        }

        this.logged = true;

        this.loggedEmitter.emit(this.logged);
        this.userEmitter.emit(this.currentUser);
        this.router.navigate(['/home']);

        Swal.fire(
          'Succesfully Logged!',
          'You have been succesfully logged!',
          'success'
        )
      } else {
        Swal.fire(
          'Error!',
          'Your username or password is incorrectF!',
          'error'
        )
      }
    })
  }

  insertUser(data) {
    return this.db.collection("user").add(data);
  };

  logOut() {
    this.currentUser = {
      id: '',
      username: '',
      password: '',
      routes: []
    };

    this.logged = false;

    this.loggedEmitter.emit(this.logged);
    this.userEmitter.emit(this.currentUser);
    this.router.navigate(['/home']);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentUserId() {
    return this.currentUser.id;
  }

  getCurrentUserUsername() {
    return this.currentUser.username;
  }

  getCurrentUserPassword() {
    return this.currentUser.password;
  }

  getCurrentUserRoutes() {
    return this.currentUser.routes;
  }

  getLogged() {
    return this.logged;
  }
}
