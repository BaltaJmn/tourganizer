import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { NgImageSliderComponent } from 'ng-image-slider';
import { environment } from '../../../../environments/environment';

import { LocalizationService } from '../../../services/localization.service';
import { ImageService } from '../../../services/image.service';

import { Image } from '../../../interfaces/Image';

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
  fileImages;
  filePath;
  fileRef;
  downloadURL;

  // Images
  @ViewChild('nav', { static: false }) slider: NgImageSliderComponent;
  images: Array<Image> = [];
  imagesToAdd = [];

  localization = new FormGroup({
    userId: new FormControl(this.userService.getCurrentUserId()),
    profile: new FormControl(environment.urlDefaultItem),
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
    private imageService: ImageService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.loaded = false;

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

    this.loaded = true;

  };

  onSubmit(localization: FormGroup) {

    if (localStorage.getItem("lat") != null) {
      localization.get("latitude").setValue(localStorage.getItem("lat"));
    };

    if (localStorage.getItem("lon") != null) {
      localization.get("longitude").setValue(localStorage.getItem("lon"));
    };

    localization.get("images").setValue(this.imagesToAdd);

    if (this.file != null) {
      const task = this.storage.upload(`images/${this.n}`, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.storage = url;

              localization.get("profile").setValue(this.storage);

              this.localizationService.createLocalization(localization.value).then(() => {

                let receivers = this.userService.getCurrentUserFollowers();
                let sender = this.userService.getCurrentUserId();

                receivers.forEach((receiver) => {

                  let notification: Notification = {
                    content: `${this.userService.getCurrentUserName()} ha creado una nueva ruta llamada ${localization.get("name").value}`,
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

    } else {

      this.localizationService.createLocalization(localization.value).then(() => {

        let receivers = this.userService.getCurrentUserFollowers();
        let sender = this.userService.getCurrentUserId();

        receivers.forEach((receiver) => {

          let notification: Notification = {
            content: `${this.userService.getCurrentUserName()} ha creado una nueva ruta llamada ${localization.get("name").value}`,
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
  };

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `images/${this.n}`;
    this.fileRef = this.storage.ref(this.filePath);
  };

  // onFileSelectedImages(event) {
  //   this.n = Date.now();
  //   this.fileImages = event.target.files[0];
  //   this.filePath = `images/${this.n}`;
  //   this.fileRef = this.storage.ref(this.filePath);

  //   const task = this.storage.upload(`images/${this.n}`, this.fileImages);

  //   task.snapshotChanges().pipe(
  //     finalize(() => {
  //       this.downloadURL = this.fileRef.getDownloadURL();
  //       this.downloadURL.subscribe(url => {
  //         if (url) {
  //           this.storage = url;

  //           let imageAux: Image = {
  //             title: this.fileImages.name.split(".")[0],
  //             image: String(this.storage),
  //             thumbImage: String(this.storage),
  //             alt: this.fileImages.name.split(".")[0]
  //           }

  //           this.imageService.createImage(imageAux).then((event: any) => {
  //             let id = event.im.path.segments[1];

  //             this.imagesToAdd.push(id);
  //             this.images.push(imageAux);
  //           });
  //         }
  //       });
  //     })
  //   ).subscribe(url => {
  //     if (url) { }
  //   });
  // };

  // deletePhoto(image) {
  //   this.images.splice(this.images.findIndex(v => v.title == image.title), 1);
  // };
}
