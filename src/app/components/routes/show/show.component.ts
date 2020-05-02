import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2'

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"

declare let L;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowRouteComponent implements OnInit {

  map;

  currentRoute: Route;

  localizations = [];

  loaded = true;

  constructor(
    private router: Router,
    private routeService: RouteService,
    private localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.map = L.map('mapid', {
      center: ["40.4636688", "-3.7492199"],
      zoom: 10
    });

    const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.activatedRoute.params.subscribe(params => {
      this.routeService.getRoute(params.id).subscribe((result) => {

        this.currentRoute = {
          id: result.id,
          userId: result.data().userId,
          name: result.data().name,
          type: result.data().type,
          totalTime: result.data().totalTime,
          rating: result.data().rating,
          localizations: result.data().localizations
        };

        this.currentRoute.localizations.forEach((localization) => {
          this.localizationService.getLocalization(localization).subscribe((localizationSnapshot) => {

            let localizationAux: Localization = {
              id: localizationSnapshot.id,
              name: localizationSnapshot.data().name,
              description: localizationSnapshot.data().description,
              likes: localizationSnapshot.data().likes,
              userId: localizationSnapshot.data().userId,
              latitude: localizationSnapshot.data().latitude,
              longitude: localizationSnapshot.data().longitude,
              images: localizationSnapshot.data().images,
              url: localizationSnapshot.data().url
            };

            const marker = L.marker([localizationAux.latitude, localizationAux.longitude]).bindPopup(localizationAux.name).addTo(this.map);

            this.localizations.push(localizationAux);

          });
        });
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
