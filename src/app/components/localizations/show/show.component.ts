import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgImageSliderComponent } from 'ng-image-slider';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { AngularFireStorage } from '@angular/fire/storage';

import { LocalizationService } from '../../../services/localization.service';
import { ImageService } from '../../../services/image.service';

import { Localization } from '../../../interfaces/Localization';
import { Image } from '../../../interfaces/Image';

import Swal from 'sweetalert2'

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"
import { icon, Marker } from 'leaflet';
import { User } from '../../../interfaces/User';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs/operators';
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
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowLocalizationComponent implements OnInit {

  // Map
  private map;

  //Profile Variables
  n = Date.now();
  file;
  filePath;
  fileRef;
  downloadURL;

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

  currentLocalization: Localization = {
    id: "",
    userId: "",
    profile: "",
    name: "",
    description: "",
    confirmed: false,
    images: [],
    latitude: "",
    longitude: "",
    likes: [],
    url: ""
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

  loaded = true;

  // Images
  @ViewChild('nav', { static: false }) slider: NgImageSliderComponent;
  images: Array<Image> = [];

  constructor(
    private router: Router,
    private localizationService: LocalizationService,
    public userService: UserService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      this.currentUser = this.userService.getCurrentUser();

      this.localizationService.getLocalization(params.id).subscribe((result) => {

        this.currentLocalization = {
          id: result.id,
          userId: result.data().userId,
          profile: result.data().profile,
          name: result.data().name,
          description: result.data().description,
          confirmed: result.data().confirmed,
          images: result.data().images,
          latitude: result.data().latitude,
          longitude: result.data().longitude,
          likes: result.data().likes,
          url: result.data().url
        };

        this.userService.getUserGET(this.currentLocalization.userId).subscribe((result) => {
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

        this.map = L.map('mapid', {
          center: [this.currentLocalization.latitude, this.currentLocalization.longitude],
          zoom: 10
        });

        this.map.addControl(searchControl);

        const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        const marker = L.marker([this.currentLocalization.latitude, this.currentLocalization.longitude]).bindPopup(this.currentLocalization.name).addTo(this.map);

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
      });
    });
    this.loaded = true;
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
