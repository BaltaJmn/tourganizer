import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;

  constructor(private db: AngularFirestore) { }

  insertUser(data) {
    return this.db.collection("user").add(data);
  }
}
