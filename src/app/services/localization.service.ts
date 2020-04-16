import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Localization } from '../interfaces/Localization';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor(private db: AngularFirestore) { }

  getLocalizations() {
    return this.db.collection('localization', ref => ref.orderBy('likes', 'desc')).snapshotChanges();
  };

  getLocalization(data) {
    return this.db.collection('localization').doc(data).get();
  };

  getLocalizationByName(data) {
    return this.db.collection('localization', ref => ref.where('name', '==', data)).get();
  };

  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      }, err => {
        reject(err);
      });
    });
  };

  createLocalization(data) {
    return this.db.collection("localization").add(data);
  };

  updateLocalization(id, data) {
    return this.db.collection("localization")
      .doc(id)
      .set(data, { merge: true });
  };

  deleteLocalization(data) {
    return this.db.collection("localization")
      .doc(data)
      .delete()
  };
}
