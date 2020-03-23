import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor(private db: AngularFirestore) { }

  getLocalizations() {
    return this.db.collection('localization').snapshotChanges();
  }
}
