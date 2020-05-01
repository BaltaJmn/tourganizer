import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LocalizationService } from '../../../services/localization.service';

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
export class ShowLocalizationComponent implements OnInit {

  // Map
  private map;

  currentLocalization: Localization;
  loaded = true;

  imageSrc;

  constructor(
    private router: Router,
    private localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.localizationService.getLocalization(params.id).subscribe((result) => {

        this.currentLocalization = {
          id: result.id,
          userId: result.data().userId,
          name: result.data().name,
          description: result.data().description,
          images: result.data().images,
          latitude: result.data().latitude,
          longitude: result.data().longitude,
          likes: result.data().likes,
          url: result.data().url
        };

        this.imageSrc = this.currentLocalization.images[0];

        this.map = L.map('mapid', {
          center: [this.currentLocalization.latitude, this.currentLocalization.longitude],
          zoom: 10
        });

        const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        var icon = new L.icon({
          iconUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
          iconAnchor: [0, 0]
        });

        const marker = L.marker([this.currentLocalization.latitude, this.currentLocalization.longitude], { icon: icon }).bindPopup('This is Littleton, CO.').addTo(this.map);

        this.loaded = true;
      });
    });
  };

  deleteLocalization(id) {
    Swal.fire({
      title: 'Do you want to delete this localization?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        this.localizationService.deleteLocalization(id).then(() => {
          Swal.fire(
            'Deleted!',
            'This route was deleted succesfully!',
            'success'
          );

          this.router.navigate(['/localizations'])
        });
      }
    })
  };

}
