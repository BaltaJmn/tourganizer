import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2'

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"
import "leaflet/dist/leaflet.ajax.min.js"
import { icon, Marker } from 'leaflet';
import { User } from '../../../interfaces/User';
import { UserService } from '../../../services/user.service';
import { MarkerinfoComponent } from './markerinfo/markerinfo.component';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

declare let L;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowRouteComponent implements OnInit {

  map;

  public currentUser: User = {
    id: "",
    profile: "",
    username: "",
    password: "",
    email: "",
    config: {
      lang: "",
      confirmed: false,
      rol: 2
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  currentRoute: Route = {
    userId: "",
    profile: null,
    confirmed: null,
    center: null,
    name: null,
    type: null,
    totalTime: null,
    rating: {
      show: 0,
      total: 0,
      votes: []
    },
    localizations: null
  };

  creator: User = {
    id: "",
    profile: "",
    username: "",
    password: "",
    email: "",
    config: {
      lang: "",
      confirmed: false,
      rol: 2
    },
    followers: [],
    follows: [],
    createdRoutes: [],
    savedRoutes: [],
  };

  localizations = [];

  loaded = false;

  constructor(
    private router: Router,
    public routeService: RouteService,
    public userService: UserService,
    private localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      this.currentUser = this.userService.getCurrentUser();

      this.routeService.getRoute(params.id).subscribe((result) => {

        this.currentRoute = {
          id: result.id,
          userId: result.data().userId,
          profile: result.data().profile,
          confirmed: result.data().confirmed,
          center: result.data().center,
          name: result.data().name,
          type: result.data().type,
          totalTime: result.data().totalTime,
          rating: result.data().rating,
          localizations: result.data().localizations
        };

        this.userService.getUserGET(this.currentRoute.userId).subscribe((result) => {
          this.creator = {
            id: result.id,
            profile: result.data().profile,
            username: result.data().username,
            password: result.data().password,
            email: result.data().email,
            config: result.data().config,
            followers: result.data().followers,
            follows: result.data().follows,
            createdRoutes: result.data().createdRoutes,
            savedRoutes: result.data().savedRoutes,
          }
        });

        this.currentRoute.localizations.forEach((localization) => {
          this.localizationService.getLocalization(localization).subscribe((localizationSnapshot) => {

            let localizationAux: Localization = {
              id: localizationSnapshot.id,
              profile: localizationSnapshot.data().profile,
              name: localizationSnapshot.data().name,
              description: localizationSnapshot.data().description,
              confirmed: localizationSnapshot.data().confirmed,
              likes: localizationSnapshot.data().likes,
              userId: localizationSnapshot.data().userId,
              latitude: localizationSnapshot.data().latitude,
              longitude: localizationSnapshot.data().longitude,
              images: localizationSnapshot.data().images,
              url: localizationSnapshot.data().url
            };

            const marker = L.marker([localizationAux.latitude, localizationAux.longitude], { localization: localizationAux })
              .bindPopup(localizationAux.name)
              .on('mouseover', function (e) {
                this.openPopup();
              })
              .on('mouseout', function (e) {
                this.closePopup();
              })
              .on('click', this.selectLocalization)
              .addTo(this.map);

            this.localizations.push(localizationAux);

          });
        });

        this.map = L.map('mapid', {
          center: [this.currentRoute.center.latitude, this.currentRoute.center.longitude],
          zoom: 8
        });

        const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.loaded = true;
      });
    });
  };

  selectLocalization(event) {
    localStorage.setItem("localization", JSON.stringify(event.target.options.localization));
    $('#modal').trigger("click");
  }

  openModal() {
    let localization: Localization = JSON.parse(localStorage.getItem("localization"));

    const dialogRef = this.dialog.open(MarkerinfoComponent, {
      width: '400px',
      data: localization
    });
  }

  deleteRoute(route) {
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
        this.routeService.deleteRoute(route).then(() => {
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