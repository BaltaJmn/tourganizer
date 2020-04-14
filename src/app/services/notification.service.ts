import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private db: AngularFirestore) { }

  createNotification(data) {
    return this.db.collection("notification").add(data);
  }

  getNotificationsById(data) {
    return this.db.collection("notification", ref => ref.where('receiver', '==', data).where('seen', '==', false)).snapshotChanges()
  }

  updateNotificationSeen(data){
    return this.db.collection("notification").doc(data).set({seen: true}, { merge: true });     
  }
}
