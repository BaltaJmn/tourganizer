import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private db: AngularFirestore) { }

  createImage(data) {
    return this.db.collection('images').add(data);
  }

  getImage(data) {
    return this.db.collection('images').doc(data).get();
  }
}
