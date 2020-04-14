import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(private db: AngularFirestore) { }

  getRoutes() {
    return this.db.collection('route', ref => ref.orderBy('ratingTotal', 'desc')).snapshotChanges();
  };

  getRoute(data) {
    return this.db.collection("route").doc(data).get();
  }

  createRoute(data) {
    return this.db.collection("route").add(data);
  }

  updateRoute(id, data) {
    return this.db.collection("route")
      .doc(id)
      .set(data, { merge: true });
  }

  updateRouteRating(data) {
    return this.db.collection("route")
      .doc(data.id)
      .set({ratingTotal: data.ratingTotal, votes: data.votes}, { merge: true });
  }

  deleteRoute(data) {
    return this.db.collection("route")
      .doc(data)
      .delete()
  }
}
