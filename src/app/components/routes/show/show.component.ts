import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteService } from '../../../services/route.service';

import { Route } from '../../../interfaces/Route';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowRouteComponent implements OnInit {

  currentRoute: Route;
  loaded = true;

  constructor(
    private router: Router,
    private routeService: RouteService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.routeService.getRoute(params.id).subscribe((result) => {

        this.currentRoute = {
          id: result.id,
          userId: result.data().userId,
          name: result.data().name,
          type: result.data().type,
          totalTime: result.data().totalTime,
          ratingTotal: result.data().ratingTotal,
          votes: result.data().votes,
          localizations: result.data().localizations
        };

        this.loaded = true;
      });
    });
  };

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
          );

          this.router.navigate(['/routes'])
        });
      }
    })
  };

}
