import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { LocalizationService } from '../../../services/localization.service';

import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"
import "leaflet/dist/leaflet.ajax.min.js"
import { icon, Marker } from 'leaflet';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../interfaces/Notification';
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
export class AddLocalizationComponent implements OnInit {

  loaded = true;

  // Map
  private map;

  //Profile Variables
  n = Date.now();
  file;
  filePath;
  fileRef;
  downloadURL;

  localization = new FormGroup({
    userId: new FormControl(''),
    profile: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    confirmed: new FormControl(false),
    likes: new FormControl([]),
    latitude: new FormControl(0),
    longitude: new FormControl(0),
    url: new FormControl('', [Validators.required]),
    images: new FormControl([]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private localizationService: LocalizationService,
    private notificationService: NotificationService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.loaded = false;

    this.map = L.map('mapid', {
      center: [0, 0],
      zoom: 4
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

    this.loaded = true;

  };

  onSubmit(localization: FormGroup) {
    const task = this.storage.upload(`images/${this.n}`, this.file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.storage = url;

            this.localization.get("profile").setValue(this.storage);
            this.localization.get("userId").setValue(this.userService.getCurrentUserId());
            this.localization.get("latitude").setValue(localStorage.getItem("lat"));
            this.localization.get("longitude").setValue(localStorage.getItem("lon"));

            this.localizationService.createLocalization(localization.value).then(() => {

              let receivers = this.userService.getCurrentUserFollowers();
              let sender = this.userService.getCurrentUserId();

              receivers.forEach((receiver) => {

                let notification: Notification = {
                  content: `${this.userService.getCurrentUserName()} a creado una nueva ruta llamada ${this.localization.get("name").value}`,
                  sender: sender,
                  receiver: receiver,
                  seen: false,
                  date: new Date
                };

                this.notificationService.createNotification(notification);
              });

              localStorage.clear();

              Swal.fire('Great!', 'Your localization was created succesfully!', 'success').then(() => {
                this.router.navigate(['/localizations']);
              });
            });
          }
        });
      })
    ).subscribe(url => {
      if (url) { }
    });
  };

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `images/${this.n}`;
    this.fileRef = this.storage.ref(this.filePath);
  };

}
