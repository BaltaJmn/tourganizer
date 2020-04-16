import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';
import { NotificationService } from '../../../services/notification.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';
import { Notification } from '../../../interfaces/Notification';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddRouteComponent implements OnInit {

  loaded = true;

  localizations = [];
  currentLocalizations = [];

  route = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    totalTime: new FormControl(0, [Validators.required]),
    ratingTotal: new FormControl(0, [Validators.required]),
    votes: new FormControl(0, [Validators.required]),
    localizations: new FormControl([], [Validators.required])
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private routeService: RouteService,
    private localizationService: LocalizationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.loaded = false;

    //Añade items al select
    this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
      localizationsSnapshot.forEach((doc: any) => {

        let localizationAux: Localization = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          name: doc.payload.doc.data().name,
          description: doc.payload.doc.data().description,
          images: doc.payload.doc.data().images,
          latitude: doc.payload.doc.data().latitude,
          longitude: doc.payload.doc.data().longitude,
          likes: doc.payload.doc.data().likes,
          url: doc.payload.doc.data().url
        }
        
        this.localizations.push(localizationAux);
      })
      this.localizations = Object.values(this.localizations);
      this.loaded = true;
    });
  }

  onSubmit(route: FormGroup) {
    this.route.get("userId").setValue(this.userService.getCurrentUserId());
    this.route.get("localizations").setValue(this.currentLocalizations);

    this.routeService.createRoute(route.value).then(() => {

      let receivers = this.userService.getCurrentUserFollowers();
      let sender = this.userService.getCurrentUserId();

      receivers.forEach((receiver) => {

        let notification: Notification = {
          content: `${this.userService.getCurrentUserName()} a creado una nueva ruta llamada ${this.route.get("name").value}`,
          sender: sender,
          receiver: receiver,
          seen: false
        };

        this.notificationService.createNotification(notification);
      })

      Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/routes']);
      });
    });
  }

}
