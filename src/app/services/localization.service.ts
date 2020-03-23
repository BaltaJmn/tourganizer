import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  db: AngularFirestore;

  constructor() { }

  getLocalizations() {
    return this.db.collection('/localization').valueChanges();
  }
}
