import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { NgImageSliderComponent } from 'ng-image-slider';

import { LocalizationService } from '../../../services/localization.service';

import { Localization } from '../../../interfaces/Localization';
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
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../../../interfaces/User';
import { ImageService } from '../../../services/image.service';

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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditLocalizationComponent implements OnInit {

  loaded = true;

  id;

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

  localization = new FormGroup({
    userId: new FormControl(''),
    profile: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    confirmed: new FormControl(false, [Validators.required]),
    likes: new FormControl([]),
    latitude: new FormControl(0),
    longitude: new FormControl(0),
    url: new FormControl('', [Validators.required]),
    images: new FormControl([]),
  });

  currentLocalization: Localization = {
    id: "",
    profile: "",
    userId: "",
    name: "",
    description: "",
    confirmed: false,
    images: [],
    latitude: "",
    longitude: "",
    likes: [],
    url: ""
  };

  currentUser: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private localizationService: LocalizationService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private imageService: ImageService,
    private storage: AngularFireStorage
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.id = event.url.split('/')[2]
      };
    });

    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {

      this.loaded = false;

      this.localizationService.getLocalization(this.id).subscribe((result) => {

        this.currentLocalization = {
          id: result.id,
          userId: result.data().userId,
          profile: result.data().profile,
          name: result.data().name,
          description: result.data().description,
          confirmed: result.data().confirmed,
          likes: result.data().likes,
          latitude: result.data().latitude,
          longitude: result.data().longitude,
          url: result.data().url,
          images: result.data().images,
        };

        this.localization.get("userId").setValue(this.currentLocalization.userId);
        this.localization.get("profile").setValue(this.currentLocalization.profile);
        this.localization.get("name").setValue(this.currentLocalization.name);
        this.localization.get("description").setValue(this.currentLocalization.description);
        this.localization.get("confirmed").setValue(this.currentLocalization.confirmed);
        this.localization.get("latitude").setValue(this.currentLocalization.latitude);
        this.localization.get("longitude").setValue(this.currentLocalization.longitude);
        this.localization.get("likes").setValue(this.currentLocalization.likes);
        this.localization.get("url").setValue(this.currentLocalization.url);
        this.localization.get("images").setValue(this.currentLocalization.images);

        this.map = L.map('mapid', {
          center: [this.localization.get("latitude").value, this.localization.get("longitude").value],
          zoom: 10
        });

        this.map.addControl(searchControl);

        const marker = L.marker([this.localization.get("latitude").value, this.localization.get("longitude").value]).addTo(this.map);

        this.map.on('geosearch/showlocation', function (e) {
          localStorage.setItem('lat', e.location.y);
          localStorage.setItem('lon', e.location.x);
        });

        const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.currentLocalization.images.forEach((image) => {
          this.imageService.getImage(image).subscribe((imageSnapshot) => {

            let imageAux: Image = {
              title: imageSnapshot.data().title,
              image: imageSnapshot.data().image,
              thumbImage: imageSnapshot.data().thumbImage,
              alt: imageSnapshot.data().alt
            }

            this.images.push(imageAux);

          });
        });

        this.loaded = true;
      });
    });
  };

  onSubmit(localization: FormGroup) {

    if (this.file != null) {
      const task = this.storage.upload(`images/${this.n}`, this.file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.storage = url;

              this.localization.get("profile").setValue(this.storage);

              if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
                this.localization.get("latitude").setValue(localStorage.getItem("lat"));
                this.localization.get("longitude").setValue(localStorage.getItem("lon"));
              }

              this.localizationService.updateLocalization(this.id, localization.value).then(() => {

                let receivers = this.userService.getCurrentUserFollowers();
                let sender = this.userService.getCurrentUserId();

                receivers.forEach((receiver) => {

                  let notification: Notification = {
                    content: `${this.userService.getCurrentUserName()} ha editado la ruta llamada ${this.localization.get("name").value}`,
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
      if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
        this.localization.get("latitude").setValue(localStorage.getItem("lat"));
        this.localization.get("longitude").setValue(localStorage.getItem("lon"));
      }

      this.localizationService.updateLocalization(this.id, localization.value).then(() => {
        Swal.fire('Great!', 'Your localization was updated succesfully!', 'success').then(() => {
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

  //             this.currentLocalization.images.push(id);

  //             this.localizationService.updateImages(this.currentLocalization);

  //             this.router.navigate([`localizations/${this.currentLocalization.id}`]);
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
  //   this.router.navigate([`localizations/${this.currentLocalization.id}`]);
  // };

}
