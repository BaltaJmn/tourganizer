import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

export interface Aux {
  name: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditRouteComponent implements OnInit {

  loaded = true;
  currentRoute: Route;

  localizations = [];
  currentLocalizations = [];

  id;

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
    private activatedRoute: ActivatedRoute
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
          name: result.data().name,
          type: result.data().type,
          totalTime: result.data().totalTime,
          ratingTotal: result.data().ratingTotal,
          votes: result.data().votes,
          localizations: result.data().localizations
        };

        //Añade items al select
        this.localizationService.getLocalizations().subscribe((localizationSnapshot) => {
          localizationSnapshot.forEach((doc) => {
            let localizationAux: Localization = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().name,
              latitude: doc.data().latitude,
              longitude: doc.data().longitude,
              likes: doc.data().likes,
              images: doc.data().images,
              url: doc.data().url,
            }
            this.localizations.push(localizationAux);
          });
          this.localizations = Object.values(this.localizations);
        });

        //Añade los tags de las localizaciones que tiene esa ruta
        this.currentLocalizations = this.currentRoute.localizations;

        this.route.get("userId").setValue(this.currentRoute.userId);
        this.route.get("name").setValue(this.currentRoute.name);
        this.route.get("type").setValue(this.currentRoute.type);
        this.route.get("totalTime").setValue(this.currentRoute.totalTime);
        this.route.get("ratingTotal").setValue(this.currentRoute.ratingTotal);
        this.route.get("votes").setValue(this.currentRoute.votes);
        this.route.get("localizations").setValue(this.currentRoute.localizations);

        this.loaded = true;

        console.log(this);
      });
    });
  }

  onSubmit(route: FormGroup) {
    this.route.get("localizations").setValue(this.currentLocalizations);

    this.routeService.updateRoute(this.id, route.value).then(() => {
      Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/routes']);
      });
    });
  }
}
