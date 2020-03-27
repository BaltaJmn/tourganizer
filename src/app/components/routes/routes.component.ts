import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RouteService } from '../../services/route.service';
import { Route } from '../../interfaces/Route';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  public ratingVariable = [];
  public routes = [];

  constructor(
    private routeService: RouteService
  ) { }

  ngOnInit(): void {
    this.routeService.getRoutes().subscribe((routesSnapshot) => {

      this.routes = [];

      routesSnapshot.forEach((doc: any) => {

        let routeAux: Route = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          name: doc.payload.doc.data().name,
          localizations: doc.payload.doc.data().localizations,
          rating: doc.payload.doc.data().rating,
          votes: doc.payload.doc.data().votes
        }

        this.routes.push(routeAux);
        this.ratingVariable.push(routeAux.rating);

      })
    });
  }

  public updateRating(route, index) {
    route.rating = this.ratingVariable[index]

    this.routeService.updateRoute(route).then(() => {
      console.log("ole");
    });
  }
}
