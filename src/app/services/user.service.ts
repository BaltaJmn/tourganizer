import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../interfaces/User';

import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;

  constructor(private db: AngularFirestore) { }

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

        Swal.fire(
          'Succesfully Logged!',
          'You have been succesfully logged!',
          'success'
        )
      } else {
        Swal.fire(
          'Error!',
          'You have been succesfully registered!',
          'error'
        )
      }
    })
  }

  insertUser(data) {
    return this.db.collection("user").add(data);
  };
}
