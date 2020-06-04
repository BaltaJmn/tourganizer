import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(
    private db: AngularFirestore,
    private userService: UserService
  ) { }

  getRoutes() {
    return this.db.collection('route', ref => ref.orderBy('rating.show', 'desc').where("confirmed", "==", true)).snapshotChanges();
  };

  getRoutesHome() {
    return this.db.collection('route', ref => ref.orderBy('rating.show', 'desc').where("confirmed", "==", true).limit(5)).snapshotChanges();
  };

  getRoutesUnconfirmed() {
    return this.db.collection('route', ref => ref.orderBy('rating.show', 'desc').where("confirmed", "==", false)).snapshotChanges();
  };

  getRoute(data) {
    return this.db.collection("route").doc(data).get();
  };

  getRouteSnapshot(data) {
    return this.db.collection("route").doc(data).snapshotChanges();
  };

  getRouteByName(data) {
    return this.db.collection('route', ref => ref.where("name", "==", data)).get();
  };

  createRoute(data) {
    return this.db.collection("route").add(data);
  };

  updateRoute(id, data) {
    return this.db.collection("route")
      .doc(id)
      .set(data, { merge: true });
  };

  updateConfirmed(data) {
    return this.db.collection("route")
      .doc(data.id)
      .set({ confirmed: true }, { merge: true });
  };

  updateRouteRating(data, value, userId) {
    data.rating.total += value;
    data.rating.votes.push(userId);
    data.rating.show = data.rating.total / data.rating.votes.length;

    return this.db.collection("route")
      .doc(data.id)
      .set({ rating: data.rating }, { merge: true });
  };

  deleteRoute(data) {
    return this.db.collection("route")
      .doc(data.id)
      .delete()
  };
}
