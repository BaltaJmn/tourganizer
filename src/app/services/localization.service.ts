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
    return this.db.collection('localization').get();
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
  }
}
