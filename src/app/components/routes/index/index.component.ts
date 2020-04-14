import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';

import { Route } from '../../../interfaces/Route';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexRouteComponent implements OnInit {

  public ratingVariable = [];
  public routes = [];
  public selectedCityIds = ["ASD"];

  constructor(
    public userService: UserService,
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
          type: doc.payload.doc.data().type,
          totalTime: doc.payload.doc.data().totalTime,
          ratingTotal: doc.payload.doc.data().ratingTotal,
          votes: doc.payload.doc.data().votes,
          localizations: doc.payload.doc.data().localizations,
        }

        this.routes.push(routeAux);
        this.ratingVariable.push(routeAux.ratingTotal / routeAux.votes);

      })
    });
  }

  updateRating(route, index) {
    route.votes++;
    route.ratingTotal += this.ratingVariable[index];
    this.ratingVariable[index] = route.ratingTotal / route.votes;

    this.routeService.updateRouteRating(route).then(() => {
      Swal.fire(
        'Thank you!',
        'Your vote was save succesfully!',
        'success'
      )
    });
  }

  deleteRoute(id) {
    Swal.fire({
      title: 'Do you want to delete this route?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        this.routeService.deleteRoute(id).then(() => {
          Swal.fire(
            'Deleted!',
            'This route was deleted succesfully!',
            'success'
          )
        });
      }
    })
  }

  imprime($event) {
    console.log(this.selectedCityIds);
    //console.log($event);
  }

}
