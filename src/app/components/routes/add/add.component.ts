import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';
import { NotificationService } from '../../../services/notification.service';

import { Localization } from '../../../interfaces/Localization';
import { Notification } from '../../../interfaces/Notification';

import Swal from 'sweetalert2';

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"
import "leaflet/dist/leaflet.ajax.min.js"
import { icon, Marker } from 'leaflet';
import { environment } from '../../../../environments/environment';
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

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddRouteComponent implements OnInit {

  loaded = true;

  // Map
  private map;

  //Profile Variables
  n = Date.now();
  file;
  filePath;
  fileRef;
  downloadURL;

  localizations = [];
  currentLocalizations = [];

  route = new FormGroup({
    userId: new FormControl(this.userService.getCurrentUserId()),
    profile: new FormControl(environment.urlDefaultItem),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    confirmed: new FormControl(false),
    center: new FormControl({ latitude: 0, longitude: 0 }),
    totalTime: new FormControl(0),
    rating: new FormControl({ show: 0, total: 0, votes: [] }),
    localizations: new FormControl([])
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private routeService: RouteService,
    private localizationService: LocalizationService,
    private notificationService: NotificationService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {

    this.loaded = false;

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
        }

        this.localizations.push(localizationAux);
      });

      this.localizations = Object.values(this.localizations);

      this.loaded = true;
    });

    this.map = L.map('mapid', {
      center: [0, 0],
      zoom: 3
    });

    this.map.addControl(searchControl);

    this.map.on('geosearch/showlocation', function (e) {
      localStorage.setItem('lat', e.location.y);
      localStorage.setItem('lon', e.location.x);
    });

    const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

  };

  onSubmit(route: FormGroup) {

    if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
      route.get("center").setValue({ latitude: localStorage.getItem("lat"), longitude: localStorage.getItem("lon") });
    }

    route.get("localizations").setValue(this.currentLocalizations);

    if (this.file != null) {
      const task = this.storage.upload(`images/${this.n}`, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.storage = url;

              route.get("profile").setValue(this.storage);

              this.routeService.createRoute(route.value).then(() => {

                let receivers = this.userService.getCurrentUserFollowers();
                let sender = this.userService.getCurrentUserId();

                receivers.forEach((receiver) => {

                  let notification: Notification = {
                    content: `${this.userService.getCurrentUserName()} a creado una nueva ruta llamada ${this.route.get("name").value}`,
                    sender: sender,
                    receiver: receiver,
                    seen: false,
                    date: new Date
                  };

                  this.notificationService.createNotification(notification);
                });

                localStorage.clear();

                Swal.fire('Great!', 'Your route was created succesfully!', 'success').then(() => {
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

      this.routeService.createRoute(route.value).then(() => {

        let receivers = this.userService.getCurrentUserFollowers();
        let sender = this.userService.getCurrentUserId();

        receivers.forEach((receiver) => {

          let notification: Notification = {
            content: `${this.userService.getCurrentUserName()} a creado una nueva ruta llamada ${this.route.get("name").value}`,
            sender: sender,
            receiver: receiver,
            seen: false,
            date: new Date
          };

          this.notificationService.createNotification(notification);
        });

        localStorage.clear();

        Swal.fire('Great!', 'Your route was created succesfully!', 'success').then(() => {
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
