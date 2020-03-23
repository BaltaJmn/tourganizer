import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent  {

  public routes: Observable<any[]>;

  constructor(
    db: AngularFirestore
  ) {
    this.routes = db.collection('/route').valueChanges();
  }

}
