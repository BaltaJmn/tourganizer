import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RouteService } from '../../services/route.service';
import { Route } from '../../interfaces/Route';

import Swal from 'sweetalert2'

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
          ratingTotal: doc.payload.doc.data().ratingTotal,
          votes: doc.payload.doc.data().votes
        }

        this.routes.push(routeAux);
        this.ratingVariable.push(routeAux.rating);

      })
    });
  }

  public updateRating(route, index) {
    route.votes++;
    route.ratingTotal += this.ratingVariable[index];
    route.rating = route.ratingTotal / route.votes;
    this.ratingVariable[index] = route.rating;

    this.routeService.updateRoute(route).then(() => {
      Swal.fire(
        'Thank you!',
        'Your vote was save succesfully!',
        'success'
      )
    });
  }
}
