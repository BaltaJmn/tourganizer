import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor(private db: AngularFirestore) { }

  getLocalizations() {
    return this.db.collection('localization').snapshotChanges();
  };

  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      }, err => {
        reject(err);
      });
    });

  }
}
