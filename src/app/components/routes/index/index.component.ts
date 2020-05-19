import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RoutesUnconfirmedComponent } from './unconfirmed/unconfirmed.component';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';

import { User } from '../../../interfaces/User';
import { Route } from '../../../interfaces/Route';

import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexRouteComponent implements OnInit {

  public currentUser: User = {
    id: "",
    profile: "",
    username: "",
    password: "",
    email: "",
    config: {
      lang: "",
      confirmed: false,
      rol: 3
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  routes: Route[] = [];
  routesUnconfirmed: Route[] = [];
  usernames = [];

  displayedColumns: string[] = ['name', 'type', 'rate', 'user', 'actions'];
  dataSource;

  nameFilter = new FormControl();
  typeFilter = new FormControl();

  filteredValues = { name: '', type: '' };

  constructor(
    public userService: UserService,
    public routeService: RouteService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser();

    this.routeService.getRoutes().subscribe((routesSnapshot) => {

      this.routes = [];

      routesSnapshot.forEach((doc: any) => {

        let routeAux: Route = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          profile: doc.payload.doc.data().profile,
          name: doc.payload.doc.data().name,
          type: doc.payload.doc.data().type,
          confirmed: doc.payload.doc.data().confirmed,
          center: doc.payload.doc.data().center,
          totalTime: doc.payload.doc.data().totalTime,
          rating: doc.payload.doc.data().rating,
          localizations: doc.payload.doc.data().localizations,
        }

        this.userService.getNameById(routeAux.userId).subscribe((user) => {

          let userAux: User = {
            id: user.id,
            profile: user.data().profile,
            username: user.data().username,
            password: user.data().password,
            email: user.data().email,
            config: user.data().config,
            followers: user.data().followers,
            follows: user.data().follows,
            createdRoutes: user.data().createdRoutes,
            savedRoutes: user.data().savedRoutes,
          }

          let aux = {
            route: routeAux.id,
            user: userAux
          }
          this.usernames.push(aux);
        })

        this.routes.push(routeAux);
      });

      this.dataSource = new MatTableDataSource(this.routes);
      this.dataSource.filterPredicate = this.customFilterPredicate();

    });

    this.routeService.getRoutesUnconfirmed().subscribe((routesSnapshot) => {

      this.routesUnconfirmed = [];

      routesSnapshot.forEach((doc: any) => {

        let routeAux: Route = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          profile: doc.payload.doc.data().profile,
          name: doc.payload.doc.data().name,
          type: doc.payload.doc.data().type,
          confirmed: doc.payload.doc.data().confirmed,
          center: doc.payload.doc.data().center,
          totalTime: doc.payload.doc.data().totalTime,
          rating: doc.payload.doc.data().rating,
          localizations: doc.payload.doc.data().localizations,
        }

        this.routesUnconfirmed.push(routeAux);
      });
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
  };

  searchName(id) {
    if (this.usernames.length > 0) {
      let aux = this.usernames.find(element => element.route == id);
      return aux.user.username;
    }
  };

  searchUser(id) {
    if (this.usernames.length > 0) {
      let aux = this.usernames.find(element => element.route == id);
      return aux.user;
    }
  };

  openModal() {
    const dialogRef = this.dialog.open(RoutesUnconfirmedComponent, {
      width: '600px',
      height: '400px',
      data: this.routesUnconfirmed
    });
  }
}
