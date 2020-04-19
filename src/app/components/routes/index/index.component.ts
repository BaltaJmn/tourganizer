import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';

import { Route } from '../../../interfaces/Route';
import { Filter } from '../../../interfaces/Filter';

import Swal from 'sweetalert2'
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexRouteComponent implements OnInit {

  ratingVariable = [];
  routes: Route[];

  displayedColumns: string[] = ['name', 'type'];
  dataSource;

  nameFilter = new FormControl();
  typeFilter = new FormControl();

  filteredValues = { name: '', type: '' };

  constructor(
    public userService: UserService,
    private routeService: RouteService
  ) { }

  ngOnInit() {
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

      });

      this.dataSource = new MatTableDataSource(this.routes);
      this.dataSource.filterPredicate = this.customFilterPredicate();

    });

    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      this.filteredValues['name'] = nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.typeFilter.valueChanges.subscribe((weightFilterValue) => {
      this.filteredValues['type'] = weightFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
  };

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
  };

  customFilterPredicate() {
    const myFilterPredicate = function (data: Route, filter: string): boolean {
      let searchString = JSON.parse(filter);

      let nameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let typeFound = data.type.toString().trim().toLowerCase().indexOf(searchString.type.toLowerCase()) !== -1

      if (searchString.topFilter) {
        return nameFound || typeFound
      } else {
        return nameFound && typeFound
      }
    }
    return myFilterPredicate;
  }
}
