import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(private db: AngularFirestore) { }

  getRoutes() {
    return this.db.collection('route').snapshotChanges();
  };

  updateRoute(data) {
    return this.db.collection("route")
    .doc(data.id)
    .set({ rating: data.rating }, { merge: true });
  }
}
