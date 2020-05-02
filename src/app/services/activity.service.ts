import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Activity } from '../interfaces/Activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private db: AngularFirestore) { }

  getActivities() {
    return this.db.collection('activity', ref => ref.orderBy('date', 'asc')).snapshotChanges();
  };

  getActivity(data) {
    return this.db.collection('activity', ref => ref.where('userId', '==', data).orderBy('date', 'asc')).snapshotChanges();
  };

  createActivityFollow(type, first, second) {

    let activity: Activity = {
      type: type,
      userId: first.id,
      date: Date(),
      content: ""
    };

    switch (type) {
      case 1:

        activity.content = `${first.username} ha seguido a ${second.username}`

        break;

      case 2:

        activity.content = `${first.username} ha dejado de seguir a ${second.username}`

        break;
    }
    return this.db.collection("activity").add(activity);
  };

}
