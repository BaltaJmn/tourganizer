import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"
import "leaflet/dist/leaflet.ajax.min.js"
import { icon, Marker } from 'leaflet';
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

const provider = new OpenStreetMapProvider();

const searchControl = new GeoSearchControl({
  provider: provider,
  showMarker: true,
  showPopup: false,
  marker: {
    icon: iconDefault,
    draggable: false,
  },
  popupFormat: ({ query, result }) => result.label,
  maxMarkers: 1,
  retainZoomLevel: false,
  animateZoom: true,
  autoClose: true,
  searchLabel: 'Enter address',
  keepResult: true
});

export interface Aux {
  name: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditRouteComponent implements OnInit {

  // Map
  private map;

  //Profile Variables
  n = Date.now();
  file = null;
  filePath;
  fileRef;
  downloadURL;

  loaded = true;
  currentRoute: Route = {
    userId: null,
    profile: null,
    confirmed: null,
    center: null,
    name: null,
    type: null,
    totalTime: null,
    rating: null,
    localizations: null
  };

  localizations = [];
  currentLocalizations = [];

  id;

  route = new FormGroup({
    userId: new FormControl(''),
    profile: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    confirmed: new FormControl(false),
    center: new FormControl(null),
    totalTime: new FormControl(0),
    rating: new FormControl({ show: 0, total: 0, votes: [] }),
    localizations: new FormControl([])
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private routeService: RouteService,
    private localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.id = event.url.split('/')[2]
      };
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {

      this.loaded = false;

      this.routeService.getRoute(this.id).subscribe((result) => {

        this.currentRoute = {
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

        this.map = L.map('mapid', {
          center: [this.currentRoute.center.latitude, this.currentRoute.center.longitude],
          zoom: 10
        });

        this.map.addControl(searchControl);

        this.map.on('geosearch/showlocation', function (e) {
          localStorage.setItem('lat', e.location.x);
          localStorage.setItem('lon', e.location.y);
        });

        const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        //Añade items al select
        this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
          localizationsSnapshot.forEach((doc: any) => {

            let localizationAux: Localization = {
              id: doc.payload.doc.id,
              userId: doc.payload.doc.data().userId,
              profile: doc.payload.doc.data().profile,
              name: doc.payload.doc.data().name,
              description: doc.payload.doc.data().description,
              confirmed: doc.payload.doc.data().confirmed,
              images: doc.payload.doc.data().images,
              latitude: doc.payload.doc.data().latitude,
              longitude: doc.payload.doc.data().longitude,
              likes: doc.payload.doc.data().likes,
              url: doc.payload.doc.data().url
            };

            this.localizations.push(localizationAux);
          });
          this.localizations = Object.values(this.localizations);
        });

        //Añade los tags de las localizaciones que tiene esa ruta
        this.currentLocalizations = this.currentRoute.localizations;

        this.route.get("userId").setValue(this.currentRoute.userId);
        this.route.get("confirmed").setValue(this.currentRoute.confirmed);
        this.route.get("name").setValue(this.currentRoute.name);
        this.route.get("type").setValue(this.currentRoute.type);
        this.route.get("localizations").setValue(this.currentRoute.localizations);

        this.loaded = true;
      });
    });
  }

  onSubmit(route: FormGroup) {

    if (this.file != null) {

      const task = this.storage.upload(`images/${this.n}`, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.storage = url;

              this.route.get("profile").setValue(this.storage);
              this.route.get("userId").setValue(this.userService.getCurrentUserId());
              this.route.get("localizations").setValue(this.currentLocalizations);

              if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
                this.route.get("center").setValue({ latitude: localStorage.getItem("lat"), longitude: localStorage.getItem("lon") });
              }

              this.routeService.updateRoute(this.id, route.value).then(() => {
                Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
                  this.router.navigate(['/routes']);
                });
              });
            }
          });
        })
      ).subscribe(url => {
        if (url) { }
      });

    } else {

      if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
        this.route.get("center").setValue({ latitude: localStorage.getItem("lat"), longitude: localStorage.getItem("lon") });
      }

      this.route.get("localizations").setValue(this.currentLocalizations);

      this.routeService.updateRoute(this.id, route.value).then(() => {
        Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
          this.router.navigate(['/routes']);
        });
      });
    }


  };

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `images/${this.n}`;
    this.fileRef = this.storage.ref(this.filePath);
  };
}
